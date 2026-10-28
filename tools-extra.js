/* ÖZnur Eğitim — Ekstra Araçlar: Hesap, Birim, Şifre */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;

/* ═══ HESAP MAKİNESİ ═══ */
OZ.tools.calc = function(){
  OZ.openModal(
    '<h2>🧮 Hesap Makinesi <button onclick="OZ.closeModal()">×</button></h2>' +
    '<input type="text" id="calcOut" readonly value="0" style="width:100%;padding:14px;font-size:22px;text-align:right;font-family:var(--mono);background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--gold);margin-bottom:10px">' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">' +
      btn('C') + btn('⌫') + btn('%') + btn('÷', 'op') +
      btn('7') + btn('8') + btn('9') + btn('×', 'op') +
      btn('4') + btn('5') + btn('6') + btn('−', 'op') +
      btn('1') + btn('2') + btn('3') + btn('+', 'op') +
      btn('0', '', 'span 2') + btn('.') + btn('=', 'eq') +
    '</div>' +
    '<p class="hint" style="margin-top:8px">İpucu: Sonuç üzerinde 🎤 mikrofon çalışır. Enter = eşittir.</p>'
  );

  function btn(label, cls, span){
    return '<button data-k="' + label + '" class="calc-btn ' + (cls || '') + '" style="' + (span ? 'grid-column:' + span + ';' : '') + '">' + label + '</button>';
  }

  const out = $('calcOut');
  let expr = '';

  function update(){ out.value = expr || '0'; }

  document.querySelectorAll('.calc-btn').forEach(function(b){
    b.onclick = function(){
      const k = b.dataset.k;
      if(k === 'C'){ expr = ''; update(); return; }
      if(k === '⌫'){ expr = expr.slice(0, -1); update(); return; }
      if(k === '='){ 
        try {
          const r = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/%/g, '/100');
          const v = Function('"use strict";return (' + r + ')')();
          expr = String(Math.round(v * 1e10) / 1e10);
          update();
        } catch(e){ out.value = 'Hata'; expr = ''; }
        return;
      }
      if(['+','−','×','÷','.','%'].includes(k)){
        if(['+','−','×','÷'].includes(k) && ['+','−','×','÷'].includes(expr.slice(-1))){ expr = expr.slice(0, -1); }
        expr += k;
      } else {
        expr += k;
      }
      update();
    };
  });

  document.addEventListener('keydown', function(e){
    if(!$('calcOut')) return;
    if(e.key === 'Enter'){ const eq = document.querySelector('.calc-btn.eq'); if(eq) eq.click(); }
    if(e.key === 'Escape'){ const c = document.querySelector('.calc-btn[data-k="C"]'); if(c) c.click(); }
  });
};

/* ═══ BİRİM ÇEVİRİCİ ═══ */
OZ.tools.convert = function(){
  const cats = {
    'Uzunluk': { m: 1, km: 1000, cm: 0.01, mm: 0.001, mil: 1609.34, ft: 0.3048, in: 0.0254 },
    'Ağırlık': { kg: 1, g: 0.001, ton: 1000, lb: 0.453592, oz: 0.0283495 },
    'Sıcaklık': null,
    'Veri': { 'B': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776 },
    'Zaman': { 'saniye': 1, 'dakika': 60, 'saat': 3600, 'gün': 86400, 'hafta': 604800 }
  };

  let html = '<h2>📏 Birim Çevirici <button onclick="OZ.closeModal()">×</button></h2>';
  html += '<label>Kategori</label><select id="convCat">';
  Object.keys(cats).forEach(function(k){ html += '<option value="' + k + '">' + k + '</option>'; });
  html += '</select>';
  html += '<label>Değer</label><input type="text" id="convVal" value="1" inputmode="decimal">';
  html += '<label>Nereden</label><select id="convFrom"></select>';
  html += '<label>Nereye</label><select id="convTo"></select>';
  html += '<button class="btn primary" id="convRun">🔄 Çevir</button>';
  html += '<div class="out" id="convOut" style="margin-top:10px">Sonuç burada</div>';

  OZ.openModal(html);

  function fillUnits(){
    const cat = $('convCat').value;
    const from = $('convFrom'), to = $('convTo');
    from.innerHTML = ''; to.innerHTML = '';
    if(cat === 'Sıcaklık'){
      ['Celsius','Fahrenheit','Kelvin'].forEach(function(u){
        from.innerHTML += '<option>' + u + '</option>';
        to.innerHTML += '<option>' + u + '</option>';
      });
      to.value = 'Fahrenheit';
    } else {
      Object.keys(cats[cat]).forEach(function(u){
        from.innerHTML += '<option>' + u + '</option>';
        to.innerHTML += '<option>' + u + '</option>';
      });
    }
  }

  $('convCat').onchange = fillUnits;
  fillUnits();

  $('convRun').onclick = function(){
    const cat = $('convCat').value;
    const v = parseFloat($('convVal').value.replace(',', '.'));
    const f = $('convFrom').value, t = $('convTo').value;
    if(isNaN(v)){ $('convOut').textContent = '❌ Geçersiz sayı'; return; }

    let r;
    if(cat === 'Sıcaklık'){
      let c = v;
      if(f === 'Fahrenheit') c = (v - 32) * 5/9;
      else if(f === 'Kelvin') c = v - 273.15;
      if(t === 'Celsius') r = c;
      else if(t === 'Fahrenheit') r = c * 9/5 + 32;
      else r = c + 273.15;
    } else {
      r = v * cats[cat][f] / cats[cat][t];
    }
    $('convOut').textContent = '✅ ' + v + ' ' + f + ' = ' + (Math.round(r * 1e6) / 1e6) + ' ' + t;
  };
};

/* ═══ ŞİFRE ÜRETİCİ ═══ */
OZ.tools.password = function(){
  OZ.openModal(
    '<h2>🔐 Şifre Üretici <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Uzunluk: <span id="pwLenLabel">16</span></label>' +
    '<input type="range" id="pwLen" min="8" max="64" value="16" style="width:100%">' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px">' +
      '<label style="margin:0"><input type="checkbox" id="pwUpper" checked> Büyük harf</label>' +
      '<label style="margin:0"><input type="checkbox" id="pwLower" checked> Küçük harf</label>' +
      '<label style="margin:0"><input type="checkbox" id="pwDigit" checked> Rakam</label>' +
      '<label style="margin:0"><input type="checkbox" id="pwSym" checked> Sembol</label>' +
    '</div>' +
    '<button class="btn primary" id="pwGen" style="margin-top:10px">🎲 Yeni Şifre</button>' +
    '<div class="out" id="pwOut" style="font-size:18px;text-align:center;padding:14px;font-weight:600;letter-spacing:1px">—</div>' +
    '<div id="pwStrength" style="text-align:center;font-size:12px;margin-top:6px"></div>' +
    '<button class="btn" id="pwCopy" style="margin-top:8px">📋 Kopyala</button>'
  );

  $('pwLen').oninput = function(){ $('pwLenLabel').textContent = this.value; };

  function generate(){
    const len = +$('pwLen').value;
    let chars = '';
    if($('pwUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if($('pwLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if($('pwDigit').checked) chars += '0123456789';
    if($('pwSym').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if(!chars){ $('pwOut').textContent = 'Bir seçenek işaretle'; return; }
    let pw = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for(let i = 0; i < len; i++){ pw += chars[arr[i] % chars.length]; }
    $('pwOut').textContent = pw;

    const hasUpper = /[A-Z]/.test(pw), hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw), hasSym = /[^A-Za-z0-9]/.test(pw);
    const variety = [hasUpper, hasLower, hasDigit, hasSym].filter(Boolean).length;
    let score = 0;
    if(len >= 8) score++; if(len >= 12) score++; if(len >= 16) score++;
    if(variety >= 3) score++; if(variety === 4) score++;
    const label = score >= 5 ? '🟢 Çok güçlü' : score >= 4 ? '🟢 Güçlü' : score >= 3 ? '🟡 Orta' : '🔴 Zayıf';
    $('pwStrength').textContent = label;
  }

  $('pwGen').onclick = generate;
  $('pwCopy').onclick = async function(){
    try {
      await navigator.clipboard.writeText($('pwOut').textContent);
      U.toast('Kopyalandı ✓');
    } catch(e){ U.toast('Kopyalanamadı'); }
  };

  generate();
};

/* views.tools'u genişlet — 3 yeni kart ekle */
const _viewsTools = OZ.views.tools;
OZ.views.tools = function(container){
  _viewsTools.call(this, container);
  setTimeout(function(){
    const grid = container.querySelector('.grid2');
    if(!grid) return;
    if(grid.querySelector('[data-tool="calc"]')) return;

    [['calc','🧮','Hesap Makinesi','Bilimsel + temel'],
     ['convert','📏','Birim Çevirici','Uzunluk, ağırlık, sıcaklık'],
     ['password','🔐','Şifre Üretici','Güvenli rastgele şifre']].forEach(function(it){
      const d = document.createElement('div');
      d.className = 'card clickable';
      d.dataset.tool = it[0];
      d.innerHTML = '<h4>' + it[1] + ' ' + it[2] + '</h4><p>' + it[3] + '</p>';
      d.onclick = function(){ OZ.tools[it[0]](); };
      grid.appendChild(d);
    });
  }, 50);
};

/* Calc butonu CSS */
const style = document.createElement('style');
style.textContent = '.calc-btn{padding:14px 8px;border-radius:10px;border:1px solid var(--border);background:var(--panel2);color:var(--ink);font-size:16px;font-weight:600;cursor:pointer;font-family:inherit;transition:.1s}.calc-btn:active{transform:scale(.96);background:var(--gold);color:#1a1400}.calc-btn.op{background:var(--purple2);color:#fff;border-color:transparent}.calc-btn.eq{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#1a1400;border-color:transparent;grid-column:span 2}';
document.head.appendChild(style);

console.log('[Tools-Extra] 3 yeni araç eklendi');
})();
