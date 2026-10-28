/* ÖZnur Eğitim — Sesli giriş (mikrofon) */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S;

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if(!SR){
  console.warn('[Voice] Bu tarayıcı ses tanımayı desteklemiyor');
  window.__oznurVoiceUnsupported = true;
  return;
}
console.log('[Voice] ses tanıma destekleniyor');

let recognition = null;
let listening = false;

function getLang(){
  if(S.prefs.lang === 'az') return 'az-AZ';
  if(S.prefs.lang === 'en') return 'en-US';
  return 'tr-TR';
}

function stopMic(){
  if(recognition){
    try { recognition.stop(); } catch(e){}
  }
  listening = false;
  updateMicBtn();
}

function updateMicBtn(){
  const btn = U.$('micBtn');
  if(!btn) return;
  if(listening){
    btn.classList.add('listening');
    btn.textContent = '⏹';
    btn.title = 'Dinleniyor... durdurmak için bas';
  } else {
    btn.classList.remove('listening');
    btn.textContent = '🎤';
    btn.title = 'Konuşarak sor';
  }
}

function startMic(){
  const input = U.$('msgInput');
  if(!input) return;
  if(listening){ stopMic(); return; }

  recognition = new SR();
  recognition.lang = getLang();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  listening = true;
  updateMicBtn();
  U.toast('🎤 Dinleniyor... konuş');

  let finalText = '';
  let interimText = '';

  recognition.onresult = function(e){
    interimText = '';
    for(let i = e.resultIndex; i < e.results.length; i++){
      const t = e.results[i][0].transcript;
      if(e.results[i].isFinal) finalText += t;
      else interimText += t;
    }
    input.value = (finalText + interimText).trim();
    input.style.height = 'auto';
    input.style.height = Math.min(120, input.scrollHeight) + 'px';
  };

  recognition.onerror = function(e){
    listening = false;
    updateMicBtn();
    if(e.error === 'not-allowed' || e.error === 'service-not-allowed'){
      U.toast('❌ Mikrofon izni gerekli — Ayarlardan izin ver');
    } else if(e.error === 'no-speech'){
      U.toast('Ses algılanmadı, tekrar dene');
    } else if(e.error === 'network'){
      U.toast('İnternet bağlantısı gerekli');
    } else {
      U.toast('Mikrofon hatası: ' + e.error);
    }
  };

  recognition.onend = function(){
    listening = false;
    updateMicBtn();
    const text = input.value.trim();
    if(text && text.length > 1){
      setTimeout(function(){ OZ.sendMessage(); }, 200);
    }
  };

  try {
    recognition.start();
  } catch(e){
    listening = false;
    updateMicBtn();
    U.toast('Mikrofon başlatılamadı: ' + e.message);
  }
}

/* Composer'a mic butonu ekle */
function attachMic(){
  const composer = document.querySelector('.composer');
  if(!composer) return;
  if(composer.querySelector('#micBtn')) return;
  const send = composer.querySelector('.send');
  if(!send) return;

  const micBtn = document.createElement('button');
  micBtn.type = 'button';
  micBtn.id = 'micBtn';
  micBtn.className = 'mic-btn';
  micBtn.textContent = '🎤';
  micBtn.title = 'Konuşarak sor';
  micBtn.onclick = startMic;

  composer.insertBefore(micBtn, send);

  /* Composer grid: 2 sütun → 3 sütun (textarea + mic + send) */
  composer.style.gridTemplateColumns = 'minmax(0,1fr) 44px 48px';
  console.log('[Voice] mikrofon butonu eklendi');
}

/* Her 400ms'de kontrol et — sohbet sekmesi render olunca yakalar */
setInterval(attachMic, 400);
setTimeout(attachMic, 100);
setTimeout(attachMic, 600);

OZ.voiceStart = startMic;
OZ.voiceStop = stopMic;
console.log('[Voice] hazır');
})();
