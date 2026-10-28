/* ÖZnur Eğitim — Cila: AMOLED, kategori ikonları, tık sesi */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;
console.log('[Polish] yükleniyor...');

/* ═══ KATEGORİ İKONLARI ═══ */
const CAT_ICONS = {
  'Donanım': '🖥️',
  'İşletim Sistemi': '💻',
  'Linux': '🐧',
  'Python Temel': '🐍',
  'Python Veri': '📊',
  'Python Orta': '🎯',
  'Python İleri': '🚀',
  'Algoritma': '🧮',
  'Araçlar': '🔧',
  'Veri': '🗄️',
  'Web': '🌐',
  'AI': '🤖',
  'Güvenlik': '🔒',
  'Kariyer': '💼',
  'Genel': '📚'
};

/* Öğren sekmesindeki kategori kartlarına ikon ekle */
function decorateCategories(){
  if(S.tab !== 'learn') return;
  document.querySelectorAll('[data-action="showCat"]').forEach(function(card){
    if(card.dataset.decorated) return;
    const cat = card.dataset.arg;
    const h4 = card.querySelector('h4');
    if(!h4) return;
    const icon = CAT_ICONS[cat] || '📁';
    if(h4.textContent.indexOf(icon) === -1){
      h4.innerHTML = '<span class="cat-icon">' + icon + '</span>' + h4.innerHTML;
    }
    card.dataset.decorated = '1';
  });
}

/* Modal kategori başlığına da ikon */
const _showCat = OZ.showCat;
OZ.showCat = function(cat){
  _showCat.call(this, cat);
  setTimeout(function(){
    const h2 = document.querySelector('#modal-content h2');
    if(h2 && !h2.querySelector('.cat-icon')){
      const icon = CAT_ICONS[cat] || '📁';
      h2.innerHTML = '<span class="cat-icon">' + icon + '</span>' + h2.innerHTML;
    }
  }, 20);
};

/* ═══ TIK SESİ (Web Audio API — dosyasız) ═══ */
let audioCtx = null;
function getCtx(){
  if(!audioCtx){
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e){ return null; }
  }
  return audioCtx;
}

function clickSound(){
  if(S.prefs.soundOff) return;
  const ctx = getCtx();
  if(!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 1200;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

/* Buton, chip, gönder dokununca tık */
document.addEventListener('touchstart', function(e){
  const t = e.target.closest('button, .chip, .send, .mic-btn, .card.clickable, #bottomnav button');
  if(t) clickSound();
}, {passive: true});

document.addEventListener('click', function(e){
  const t = e.target.closest('button, .chip, .send, .mic-btn, .card.clickable, #bottomnav button');
  if(t && !('ontouchstart' in window)) clickSound();
});

/* ═══ AYARLAR'A AMOLED + SES SEÇENEĞİ EKLE ═══ */
const _showSettings = OZ.showSettings;
OZ.showSettings = function(){
  _showSettings.call(this);
  setTimeout(function(){
    /* Tema seg'ine AMOLED ekle */
    const themeSeg = $('themeSeg');
    if(themeSeg && !themeSeg.querySelector('[data-v="amoled"]')){
      const btn = document.createElement('button');
      btn.dataset.v = 'amoled';
      btn.textContent = 'AMOLED';
      btn.className = (S.prefs.theme === 'amoled' ? 'on' : '');
      themeSeg.appendChild(btn);
      themeSeg.style.gridTemplateColumns = 'repeat(4,1fr)';
    }

    /* Ses toggle ekle */
    const fontLabel = $('fontLabel');
    if(fontLabel && !$('soundToggle')){
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid var(--border);margin-top:10px';
      wrap.innerHTML = 
        '<span style="font-size:12px;color:var(--muted);font-weight:600">🔊 Tık sesi</span>' +
        '<button id="soundToggle" style="padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:' + (S.prefs.soundOff ? 'var(--panel2)' : 'var(--gold)') + ';color:' + (S.prefs.soundOff ? 'var(--muted)' : '#1a1400') + ';font-weight:700;font-size:12px">' + (S.prefs.soundOff ? 'KAPALI' : 'AÇIK') + '</button>';
      fontLabel.closest('.modal, #modal-content').appendChild(wrap);

      $('soundToggle').onclick = function(){
        S.prefs.soundOff = !S.prefs.soundOff;
        this.textContent = S.prefs.soundOff ? 'KAPALI' : 'AÇIK';
        this.style.background = S.prefs.soundOff ? 'var(--panel2)' : 'var(--gold)';
        this.style.color = S.prefs.soundOff ? 'var(--muted)' : '#1a1400';
        OZ.storage.set('prefs', S.prefs);
        if(!S.prefs.soundOff) clickSound();
      };
    }

    /* AMOLED butonunu tıklanabilir yap */
    if(themeSeg){
      themeSeg.onclick = function(e){
        const b = e.target.closest('button');
        if(!b) return;
        S.prefs.theme = b.dataset.v;
        themeSeg.querySelectorAll('button').forEach(function(x){
          x.classList.toggle('on', x.dataset.v === S.prefs.theme);
        });
        OZ.applyTheme();
        OZ.storage.set('prefs', S.prefs);
      };
    }
  }, 50);
};

/* Öğren sekmesi her render'da ikonları düzenle */
const _render = OZ.render;
OZ.render = function(){
  _render.apply(this, arguments);
  setTimeout(decorateCategories, 80);
};

/* İlk yükleme */
setTimeout(decorateCategories, 500);
setTimeout(decorateCategories, 1500);

console.log('[Polish] hazır');
})();
