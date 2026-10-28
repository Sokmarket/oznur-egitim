/* ÖZnur Eğitim — TTS v3 (polling — en sağlam) */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S;
let currentUtter = null;

if(!('speechSynthesis' in window)){
  console.warn('[TTS] desteklenmiyor');
  return;
}

function cleanText(html){
  return String(html)
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' [kod] ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/\s+/g,' ').trim();
}

function getLang(){
  if(S.prefs.lang === 'az') return 'az-AZ';
  if(S.prefs.lang === 'en') return 'en-US';
  return 'tr-TR';
}

function pickVoice(lang){
  try {
    const v = speechSynthesis.getVoices() || [];
    const s = lang.split('-')[0];
    return v.find(x => x.lang === lang) || v.find(x => x.lang && x.lang.indexOf(s) === 0) || null;
  } catch(e){ return null; }
}

function stopSpeak(){
  try { speechSynthesis.cancel(); } catch(e){}
  if(currentUtter && currentUtter._btn){
    currentUtter._btn.classList.remove('speaking');
    currentUtter._btn.textContent = '🔊';
  }
  currentUtter = null;
}

function speak(html, btn){
  if(currentUtter && currentUtter._btn === btn){ stopSpeak(); return; }
  stopSpeak();
  const text = cleanText(html);
  if(!text || text.length < 2){ U.toast('Okunacak metin yok'); return; }
  const utter = new SpeechSynthesisUtterance(text.slice(0, 3000));
  utter.lang = getLang();
  utter.rate = S.prefs.ttsRate || 1;
  const voice = pickVoice(utter.lang);
  if(voice) utter.voice = voice;
  utter._btn = btn;
  if(btn){ btn.classList.add('speaking'); btn.textContent = '⏹'; }
  utter.onend = utter.onerror = function(){
    if(btn){ btn.classList.remove('speaking'); btn.textContent = '🔊'; }
    if(currentUtter === utter) currentUtter = null;
  };
  currentUtter = utter;
  try { speechSynthesis.speak(utter); }
  catch(e){ U.toast('Ses hatası: ' + e.message); }
}

/* ——— POLLING YÖNTEMİ: her 400ms'de sohbetteki bot mesajlarını tara ——— */
function ensureButtons(){
  document.querySelectorAll('.msg.bot').forEach(function(msg){
    if(msg.dataset.ttsDone === '1') return;
    if(msg.querySelector('.tts-btn')){ msg.dataset.ttsDone = '1'; return; }
    const btn = document.createElement('button');
    btn.className = 'tts-btn';
    btn.innerHTML = '🔊';
    btn.type = 'button';
    btn.onclick = function(e){ e.stopPropagation(); speak(msg.innerHTML, btn); };
    msg.appendChild(btn);
    msg.dataset.ttsDone = '1';
  });
}

/* 400ms'de bir çalıştır — ilk açılış + her yeni mesaj yakalanır */
setInterval(ensureButtons, 400);

/* Anında ilk deneme */
setTimeout(ensureButtons, 100);
setTimeout(ensureButtons, 500);
setTimeout(ensureButtons, 1500);

OZ.ttsSpeak = speak;
OZ.ttsStop = stopSpeak;
console.log('[TTS v3] hazır — polling ile butonlar eklenecek');
})();
