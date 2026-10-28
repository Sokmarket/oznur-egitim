/* ÖZnur Eğitim — Bootstrap */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;

function bindNav(){
  document.querySelectorAll('#bottomnav button').forEach(b => {
    b.onclick = () => {
      S.tab = b.dataset.tab;
      OZ.render();
      const v = $('view'); if(v) v.scrollTop = 0;
    };
  });
}

function bindTopbar(){
  const logo = $('logoBtn');
  if(logo) logo.onclick = () => OZ.openModal(
    '<h2>Hakkında <button onclick="OZ.closeModal()">×</button></h2>' +
    '<div style="text-align:center;margin-bottom:12px"><div style="display:inline-grid;place-items:center;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,var(--gold),var(--purple));color:#0a0714;font:800 22px Georgia,serif">Öz</div></div>' +
    '<h3 style="text-align:center;color:var(--gold);margin:0 0 12px">ÖZnur Eğitim</h3>' +
    '<p style="line-height:1.7;font-size:13.5px">Çevrimdışı çalışabilen kişisel öğrenme asistanı. <b>' + OZ.KB.length + ' konu</b>, <b>' + OZ.QUIZ.length + ' quiz</b>, <b>8 araç</b>.</p>' +
    '<p style="line-height:1.7;font-size:13.5px"><b>Yerel mod:</b> İnternet gerekmez.<br><b>AI modu:</b> Ayarlardan sağlayıcı seç.</p>' +
    '<p style="text-align:center;color:var(--muted);font-size:11px;margin-top:14px">v1.0 · PWA</p>'
  );
  const st = $('settingsBtn'); if(st) st.onclick = OZ.showSettings;
  const ov = $('modal-overlay');
  if(ov) ov.onclick = e => { if(e.target === ov) OZ.closeModal(); };
}

function bindKeyboard(){
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      const ov = $('modal-overlay');
      if(ov && !ov.classList.contains('hidden')) OZ.closeModal();
      return;
    }
    const active = document.activeElement;
    const inInput = active && /INPUT|TEXTAREA|SELECT/.test(active.tagName);
    const ovOpen = !$('modal-overlay').classList.contains('hidden');
    if(e.key === '/' && !inInput && !ovOpen){
      e.preventDefault();
      if(S.tab !== 'chat'){ S.tab = 'chat'; OZ.render(); }
      setTimeout(() => { const i = $('msgInput'); if(i) i.focus(); }, 50);
    }
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){ e.preventDefault(); OZ.showSettings(); }
  });
}

function welcome(){
  if(S.chat.length > 0) return;
  setTimeout(() => {
    OZ.addMsg(
      '<h3>Merhaba! 👋 Ben ÖZnur Eğitim Asistanı</h3>' +
      '<p><b>' + OZ.KB.length + ' konu</b>, <b>' + OZ.QUIZ.length + ' quiz</b>, <b>8 araç</b> ile çevrimdışı çalışıyorum.</p>' +
      '<ul>' +
      '<li>Konu sor: <code>değişken nedir</code>, <code>for döngüsü</code>, <code>ram</code>, <code>git</code></li>' +
      '<li><code>quiz başlat</code> — sınava gir</li>' +
      '<li><code>konular</code> — tüm müfredat</li>' +
      '<li>Alt sekmelerden <b>Araçlar</b>, <b>Profil</b>, <b>Öğren</b>\'e ulaş</li>' +
      '</ul>' +
      '<p style="color:var(--muted);font-size:12px;margin-top:12px">💡 <b>/</b> input\'a odaklar · <b>Ctrl+K</b> ayarlar · <b>Esc</b> kapatır</p>',
      'bot'
    );
  }, 400);
}

function registerSW(){
  if(!('serviceWorker' in navigator)) return;
  if(location.protocol === 'file:') return;
  navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW:', err));
}

function boot(){
  OZ.applyTheme();
  bindTopbar();
  bindNav();
  bindKeyboard();
  S.tab = 'chat';
  OZ.render();
  welcome();
  window.addEventListener('beforeunload', OZ.saveAll);
  window.addEventListener('pagehide', OZ.saveAll);
  setInterval(OZ.saveAll, 30000);
  registerSW();
  console.log('%c ÖZnur Eğitim ', 'background:linear-gradient(135deg,#f6d17b,#a78bfa);color:#0a0714;padding:4px 8px;border-radius:6px;font-weight:700');
  console.log('KB: ' + OZ.KB.length + ' · Quiz: ' + OZ.QUIZ.length);
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
