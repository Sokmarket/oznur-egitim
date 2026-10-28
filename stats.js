/* ÖZnur Eğitim — İstatistik: günlük XP takibi + haftalık rapor */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S;

console.log('[Stats] yükleniyor...');

/* Günlük XP objesi başlat */
if(!S.progress.dailyXP) S.progress.dailyXP = {};

/* OZ.saveProgress override — her XP artışını yakala */
let lastXP = S.progress.xp || 0;
const _save = OZ.saveProgress;
OZ.saveProgress = function(){
  const delta = (S.progress.xp || 0) - lastXP;
  if(delta > 0){
    const t = U.today();
    S.progress.dailyXP[t] = (S.progress.dailyXP[t] || 0) + delta;
    lastXP = S.progress.xp;
  }
  _save.apply(this, arguments);
};

/* Son 7 gün */
OZ.getWeekXP = function(){
  const days = [];
  const now = new Date();
  for(let i = 6; i >= 0; i--){
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const gunAdi = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'][d.getDay()];
    days.push({ date: key, label: gunAdi, xp: S.progress.dailyXP[key] || 0 });
  }
  return days;
};

/* Haftalık rapor modal */
OZ.showWeekReport = function(){
  const days = OZ.getWeekXP();
  const total = days.reduce(function(a, b){ return a + b.xp; }, 0);
  let max = 1;
  days.forEach(function(d){ if(d.xp > max) max = d.xp; });

  let bars = '';
  days.forEach(function(d){
    const h = Math.round(d.xp / max * 100);
    const active = d.xp > 0;
    bars += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">' +
      '<div style="height:90px;width:100%;background:var(--panel2);border-radius:6px;display:flex;align-items:flex-end;overflow:hidden">' +
        '<div style="width:100%;height:' + h + '%;' +
        'background:' + (active ? 'linear-gradient(180deg,var(--gold),var(--purple))' : 'transparent') + ';' +
        'border-radius:6px;transition:height .3s"></div>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--muted)">' + d.label + '</div>' +
      '<div style="font-size:11px;color:' + (active ? 'var(--gold)' : 'var(--muted)') + ';font-weight:600">' + d.xp + '</div>' +
    '</div>';
  });

  const streak = S.progress.streak;
  const totalXp = S.progress.xp;
  const quizAcc = S.progress.quizTotal ? Math.round(S.progress.quizCorrect / S.progress.quizTotal * 100) : 0;
  const weekActive = days.filter(function(d){ return d.xp > 0; }).length;
  const weekAvg = Math.round(total / 7);

  OZ.openModal(
    '<h2>📊 Haftalık Rapor <button onclick="OZ.closeModal()">×</button></h2>' +
    '<div style="display:flex;gap:4px;margin:6px 0 16px">' + bars + '</div>' +

    '<div class="grid3" style="margin-bottom:12px">' +
      '<div class="stat-box"><div class="num">' + total + '</div><div class="lbl">Bu Hafta</div></div>' +
      '<div class="stat-box"><div class="num">' + totalXp + '</div><div class="lbl">Toplam XP</div></div>' +
      '<div class="stat-box"><div class="num">🔥 ' + streak + '</div><div class="lbl">Seri</div></div>' +
    '</div>' +

    '<div class="card">' +
      '<h4>📈 Özet</h4>' +
      '<p>Aktif gün: <b>' + weekActive + '/7</b> · Günlük ortalama: <b>' + weekAvg + ' XP</b></p>' +
      '<p style="margin-top:4px">Quiz doğruluk: <b>' + quizAcc + '%</b> (' + S.progress.quizCorrect + '/' + S.progress.quizTotal + ')</p>' +
      '<p style="margin-top:4px">Toplam soru: <b>' + S.progress.askCount + '</b></p>' +
    '</div>' +

    '<div class="card">' +
      '<h4>💡 İpucu</h4>' +
      '<p>' + (weekActive >= 5 ? 'Harika! Bu hafta çok aktifsin. 🎉' :
                 weekActive >= 3 ? 'İyi gidiyorsun, her gün 1 soru seriyi korur.' :
                 'Sadece 1 soru bile seriyi başlatır. Bugün başla! 🚀') + '</p>' +
    '</div>' +

    '<button class="btn primary" onclick="OZ.closeModal()">Kapat</button>'
  );
};

/* Profil sekmesine buton ekle */
function attachWeekBtn(){
  const section = document.querySelector('.section');
  if(!section) return;
  if(section.querySelector('[data-week-btn]')) return;

  const titles = Array.from(section.querySelectorAll('.section-title'));
  const profilTitle = titles.find(function(el){ return el.textContent.indexOf('Profil') !== -1; });
  if(!profilTitle) return;

  const btn = document.createElement('div');
  btn.setAttribute('data-week-btn', '1');
  btn.className = 'card clickable';
  btn.innerHTML = '<h4>📊 Haftalık Rapor</h4><p>Son 7 günün XP grafiği ve özet</p>';
  btn.onclick = OZ.showWeekReport;

  const aktiviteTitle = titles.find(function(el){ return el.textContent.indexOf('Aktivite') !== -1; });
  if(aktiviteTitle){
    aktiviteTitle.parentNode.insertBefore(btn, aktiviteTitle);
  } else {
    section.appendChild(btn);
  }
}

/* Sekme değişiminde kontrol */
setInterval(function(){
  if(S.tab === 'profile') attachWeekBtn();
}, 500);

setTimeout(function(){ if(S.tab === 'profile') attachWeekBtn(); }, 300);

console.log('[Stats] haftalık rapor hazır');
})();
