/* ÖZnur Eğitim — Çoklu dil: TR/EN/AZ + AI konu çevirisi */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;
console.log('[i18n] yükleniyor...');

/* ═══ SÖZLÜK ═══ */
const TR = {
  chat: 'Sohbet', learn: 'Öğren', tools: 'Araçlar', profile: 'Profil',
  placeholder: "Bir konu sor: 'değişken nedir', 'for döngüsü'...",
  topics: 'Konu', quiz: 'Quiz', cards: 'Kart Deste', notes: 'Notlarım',
  settings: 'Ayarlar', close: 'Kapat', save: 'Kaydet', cancel: 'İptal',
  about: 'Hakkında', mode_off: 'ÇEVRİMDIŞI · YEREL MOD', mode_on: 'ÇEVRİMİÇİ',
  new_note: 'Yeni Not', search: 'Ara...', translate: '🌐 İngilizceye çevir',
  translated: 'Çevrildi', thinking: 'Çeviriliyor...'
};
const EN = {
  chat: 'Chat', learn: 'Learn', tools: 'Tools', profile: 'Profile',
  placeholder: "Ask a topic: 'what is a variable', 'for loop'...",
  topics: 'Topics', quiz: 'Quiz', cards: 'Flashcards', notes: 'My Notes',
  settings: 'Settings', close: 'Close', save: 'Save', cancel: 'Cancel',
  about: 'About', mode_off: 'OFFLINE · LOCAL MODE', mode_on: 'ONLINE',
  new_note: 'New Note', search: 'Search...', translate: '🌐 Translate to English',
  translated: 'Translated', thinking: 'Translating...'
};
const AZ = {
  chat: 'Söhbət', learn: 'Öyrən', tools: 'Alətlər', profile: 'Profil',
  placeholder: "Mövzu soruş: 'dəyişən nədir', 'for döngüsü'...",
  topics: 'Mövzu', quiz: 'Quiz', cards: 'Kart Destesi', notes: 'Qeydlərim',
  settings: 'Ayarlar', close: 'Bağla', save: 'Yadda saxla', cancel: 'Ləğv et',
  about: 'Haqqında', mode_off: 'OFFLINE · YERLİ REJİM', mode_on: 'ONLAYN',
  new_note: 'Yeni Qeyd', search: 'Axtar...', translate: '🌐 İngiliscəyə çevir',
  translated: 'Tərcümə olundu', thinking: 'Tərcümə olunur...'
};

OZ.i18n = { tr: TR, en: EN, az: AZ };

OZ.t = function(key){
  const dict = OZ.i18n[S.prefs.lang] || TR;
  return dict[key] || TR[key] || key;
};

/* ═══ ARAYÜZÜ ÇEVİR ═══ */
OZ.applyLang = function(){
  const t = OZ.t;

  /* Bottom nav */
  const navMap = { chat: 'chat', learn: 'learn', tools: 'tools', profile: 'profile' };
  document.querySelectorAll('#bottomnav button').forEach(function(b){
    const label = b.querySelector('span:last-child');
    if(label && navMap[b.dataset.tab]) label.textContent = t(navMap[b.dataset.tab]);
  });

  /* Placeholder */
  const inp = $('msgInput');
  if(inp) inp.placeholder = t('placeholder');

  /* Mode label */
  const mode = $('modeLabel');
  if(mode){
    if(OZ.aiActive()){
      const p = OZ.PROVIDERS[S.ai.provider];
      mode.textContent = t('mode_on') + ' · ' + (p ? p.short.toUpperCase() : 'AI');
    } else {
      mode.textContent = t('mode_off');
    }
  }

  console.log('[i18n] dil uygulandı:', S.prefs.lang);
};

/* ═══ AI İLE KONU ÇEVİRİSİ ═══ */
OZ.translateTopic = async function(topicId, btn){
  if(!OZ.aiActive()){
    U.toast('AI bağlı değil — Ayarlar → Groq');
    return;
  }
  const topic = OZ.KB.find(function(t){ return t.id === topicId; });
  if(!topic) return;

  /* Zaten çevrildi mi? */
  if(!S.translations) S.translations = {};
  const cacheKey = topicId + '_en';
  if(S.translations[cacheKey]){
    showTranslation(cacheKey, btn);
    return;
  }

  if(btn){ btn.disabled = true; btn.textContent = '⏳ ' + OZ.t('thinking'); }

  /* HTML'i düz metne çevir */
  const plain = topic.body.replace(/<pre[\s\S]*?<\/pre>/gi, function(m){
    return '\n' + m.replace(/<[^>]+>/g, '') + '\n';
  }).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1500);

  const prompt = 'Aşağıdaki Türkçe eğitim içeriğini İngilizceye çevir. ' +
    'Sade, doğal İngilizce kullan. Yapıyı koru (madde işaretleri, kod örnekleri). ' +
    'Sadece çeviriyi ver, açıklama ekleme.\n\n' +
    'BAŞLIK: ' + topic.title + '\n\n' +
    'İÇERİK: ' + plain;

  const reply = await OZ.askAI([
    { role: 'system', content: 'You are a translator. Translate Turkish educational content to clear English.' },
    { role: 'user', content: prompt }
  ]);

  if(!reply){
    U.toast('❌ Çeviri başarısız (internet/anahtar)');
    if(btn){ btn.disabled = false; btn.textContent = OZ.t('translate'); }
    return;
  }

  S.translations[cacheKey] = reply;
  OZ.storage.set('translations', S.translations);

  showTranslation(cacheKey, btn);
  U.toast('✅ ' + OZ.t('translated'));
};

function showTranslation(cacheKey, btn){
  const text = S.translations[cacheKey];
  if(!text) return;

  /* Modal veya bot mesajı içinde göster */
  const modal = $('modal-content');
  const container = modal || document.querySelector('.chat-list');

  /* Butonu nerede göstereceğiz — chatList içindeki son bot mesajı */
  const chats = document.querySelectorAll('.chat-list .msg.bot');
  const lastBot = chats[chats.length - 1];

  if(lastBot){
    let box = lastBot.querySelector('.translation-box');
    if(!box){
      box = document.createElement('div');
      box.className = 'translation-box';
      box.style.cssText = 'margin-top:12px;padding:12px;background:linear-gradient(135deg,rgba(246,209,123,.10),rgba(167,139,250,.10));border:1px solid var(--gold);border-radius:10px;font-size:13px;line-height:1.6;color:var(--ink)';
      lastBot.appendChild(box);
    }
    box.innerHTML = '<div style="font-size:11px;color:var(--gold);font-weight:700;margin-bottom:6px">🌐 ENGLISH TRANSLATION</div>' +
      OZ.formatAI(text);
  }
  if(btn){
    btn.disabled = false;
    btn.textContent = '✅ ' + OZ.t('translated');
    btn.style.opacity = '0.6';
  }
}

/* ═══ addMsg override — AI bot mesajına çeviri butonu ekle ═══ */
const _addMsg = OZ.addMsg;
OZ.addMsg = function(html, role){
  _addMsg.apply(this, arguments);
  if(role !== 'bot') return;
  if(S.prefs.lang === 'tr') return; /* TR'de çeviri butonu gerekmez */

  /* Son eklenen bot mesajı */
  setTimeout(function(){
    const list = document.querySelector('.chat-list');
    if(!list) return;
    const bots = list.querySelectorAll('.msg.bot');
    const last = bots[bots.length - 1];
    if(!last || last.querySelector('.tr-btn')) return;

    /* Konu mu? H3 başlığı var mı ve KB'de bulunuyor mu? */
    const h3 = last.querySelector('h3');
    if(!h3) return;
    const title = h3.textContent.replace(/^[📘📗📙📕🎯🏁🤔🤖]\s*/i, '').replace(/^[^\w\s]*\s*/, '').trim();
    const topic = OZ.KB.find(function(t){ return t.title === title || h3.textContent.indexOf(t.title) !== -1; });
    if(!topic) return;

    /* Çeviri butonu */
    const btn = document.createElement('button');
    btn.className = 'tr-btn';
    btn.textContent = OZ.t('translate');
    btn.style.cssText = 'margin-top:8px;padding:6px 12px;border-radius:16px;border:1px solid var(--gold);background:var(--panel2);color:var(--gold);font-size:11px;font-weight:600;cursor:pointer';
    btn.onclick = function(){ OZ.translateTopic(topic.id, btn); };
    last.appendChild(btn);
  }, 100);
};

/* ═══ AYARLAR'da dil seçici dinle ═══ */
const _showSettings = OZ.showSettings;
OZ.showSettings = function(){
  _showSettings.call(this);
  setTimeout(function(){
    const sel = $('langSel');
    if(sel && !sel._langBound){
      sel.onchange = function(){
        S.prefs.lang = this.value;
        OZ.storage.set('prefs', S.prefs);
        OZ.applyLang();
        U.toast('Dil değişti: ' + ({tr:'Türkçe',en:'English',az:'Azərbaycanca'}[this.value] || this.value));
      };
      sel._langBound = true;
    }
  }, 60);
};

/* ═══ RENDER override ═══ */
const _render = OZ.render;
OZ.render = function(){
  _render.apply(this, arguments);
  setTimeout(OZ.applyLang, 60);
};

/* İlk yükleme */
setTimeout(OZ.applyLang, 500);
setTimeout(OZ.applyLang, 2000);

console.log('[i18n] hazır (aktif dil: ' + S.prefs.lang + ')');
})();
