/* ÖZnur Eğitim — Kart AI Zenginleştirme */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;
console.log('[Card-AI] yükleniyor...');

/* AI ile kart açıklaması iste */
async function explainCard(card, btn){
  if(!OZ.aiActive()){
    U.toast('AI bağlı değil — Ayarlar → Groq anahtarı gir');
    return;
  }
  if(btn){ btn.disabled = true; btn.textContent = '⏳ AI düşünüyor...'; }

  const prompt = 'Aşağıdaki konu hakkında öğrenciye 3-5 cümlelik sade Türkçe açıklama yap. ' +
    'Gerekirse küçük bir kod veya örnek ver. Kısa ve öz ol.\n\n' +
    'Konu: ' + card.front;

  const messages = [
    { role: 'system', content: 'Sen kısa ve anlaşılır Türkçe öğretmen asistanısın.' },
    { role: 'user', content: prompt }
  ];

  const reply = await OZ.askAI(messages);

  if(!reply){
    U.toast('❌ AI cevap vermedi (internet/anahtar)');
    if(btn){ btn.disabled = false; btn.textContent = '🤖 AI ile Açıkla'; }
    return;
  }

  /* Kart üzerine kaydet */
  card.aiBack = reply;
  card.aiTs = Date.now();
  OZ.storage.set('cards', S.cards);

  /* Modal'da göster */
  const cardBox = btn.closest('.card') || btn.parentNode;
  let aiBox = cardBox.querySelector('.ai-explain');
  if(!aiBox){
    aiBox = document.createElement('div');
    aiBox.className = 'ai-explain';
    aiBox.style.cssText = 'margin-top:12px;padding:12px;background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(246,209,123,.12));border:1px solid var(--purple);border-radius:10px;font-size:13px;line-height:1.6;color:var(--ink);white-space:pre-wrap';
    cardBox.appendChild(aiBox);
  }
  aiBox.innerHTML = '<div style="font-size:11px;color:var(--purple);font-weight:700;margin-bottom:6px">🤖 AI Açıklaması</div>' +
    OZ.formatAI(reply);
  btn.style.display = 'none';
  U.toast('✅ AI açıklaması eklendi');
}

/* showCards override — AI butonu ekle */
const _showCards = OZ.showCards;
OZ.showCards = function(){
  _showCards.call(this);
  setTimeout(function(){
    const modal = $('modal-content');
    if(!modal) return;

    /* Sadece "Tekrar" ekranına ekle (kart gösteriliyorsa) */
    const cardAnswer = modal.querySelector('#cardAnswer');
    if(!cardAnswer) return;
    if(modal.querySelector('.ai-btn')) return;

    /* Hangi kart? due[0] */
    const due = S.cards.filter(function(c){ return new Date(c.due || 0) <= new Date(); });
    if(!due.length) return;
    const currentCard = due[0];

    /* AI butonu */
    const btn = document.createElement('button');
    btn.className = 'btn ai-btn';
    btn.innerHTML = currentCard.aiBack ? '✨ AI Açıklamasını Göster' : '🤖 AI ile Açıkla';
    btn.style.cssText = 'width:100%;padding:11px;border-radius:10px;border:1px solid var(--purple);background:var(--panel2);color:var(--purple);font:600 13.5px var(--font);margin-top:8px;cursor:pointer';

    if(currentCard.aiBack){
      /* Zaten var → göster */
      btn.onclick = function(){
        const cardBox = btn.closest('.card');
        let aiBox = cardBox.querySelector('.ai-explain');
        if(!aiBox){
          aiBox = document.createElement('div');
          aiBox.className = 'ai-explain';
          aiBox.style.cssText = 'margin-top:12px;padding:12px;background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(246,209,123,.12));border:1px solid var(--purple);border-radius:10px;font-size:13px;line-height:1.6;color:var(--ink);white-space:pre-wrap';
          cardBox.appendChild(aiBox);
        }
        aiBox.innerHTML = '<div style="font-size:11px;color:var(--purple);font-weight:700;margin-bottom:6px">🤖 AI Açıklaması</div>' +
          OZ.formatAI(currentCard.aiBack);
        btn.style.display = 'none';
      };
    } else {
      btn.onclick = function(){ explainCard(currentCard, btn); };
    }

    /* "Cevabı Göster" butonunun altına ekle */
    const showAns = modal.querySelector('#showAns');
    if(showAns && showAns.parentNode){
      showAns.parentNode.insertBefore(btn, showAns.nextSibling);
    } else {
      modal.appendChild(btn);
    }
  }, 80);
};

/* Toplu AI zenginleştirme — Ayarlar altında */
OZ.enrichAllCards = async function(limit){
  limit = limit || 20;
  if(!OZ.aiActive()){
    U.toast('AI bağlı değil');
    return;
  }
  const needs = S.cards.filter(function(c){ return !c.aiBack; }).slice(0, limit);
  if(!needs.length){
    U.toast('Tüm kartlar AI açıklamalı ✓');
    return;
  }
  if(!confirm(needs.length + ' kart AI ile zenginleştirilecek. Devam?')) return;

  let done = 0, failed = 0;
  for(let i = 0; i < needs.length; i++){
    const c = needs[i];
    U.toast('(' + (i + 1) + '/' + needs.length + ') ' + c.front.slice(0, 30) + '…', 800);
    const reply = await OZ.askAI([
      { role: 'system', content: 'Kısa, sade, örnekli Türkçe öğretmen.' },
      { role: 'user', content: '3-5 cümlelik kısa açıklama yap: ' + c.front }
    ]);
    if(reply){ c.aiBack = reply; c.aiTs = Date.now(); done++; }
    else failed++;
    await new Promise(function(r){ setTimeout(r, 1200); }); /* rate limit koruma */
  }
  OZ.storage.set('cards', S.cards);
  U.toast('✅ ' + done + ' kart zenginleşti' + (failed ? ' · ❌ ' + failed : ''), 3000);
};

/* Profil → Veri bölümüne "AI ile kartları zenginleştir" */
function attachEnrichBtn(){
  if(S.tab !== 'profile') return;
  const section = document.querySelector('.section');
  if(!section || section.querySelector('[data-enrich]')) return;
  const dataTitle = Array.from(section.querySelectorAll('.section-title')).find(function(el){
    return el.textContent.indexOf('Veri') !== -1;
  });
  if(!dataTitle) return;

  const card = document.createElement('div');
  card.className = 'card clickable';
  card.setAttribute('data-enrich', '1');
  card.innerHTML = '<h4>🤖 Kartları AI ile Zenginleştir</h4><p>20 kart için AI açıklaması al (yavaş, API kotası)</p>';
  card.onclick = function(){ OZ.enrichAllCards(20); };
  dataTitle.parentNode.insertBefore(card, dataTitle.nextSibling);
}

setInterval(function(){ if(S.tab === 'profile') attachEnrichBtn(); }, 500);
setTimeout(attachEnrichBtn, 400);

console.log('[Card-AI] hazır');
})();
