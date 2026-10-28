/* ÖZnur Eğitim — PDF Export: notlar + sohbet */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;
console.log('[PDF] yükleniyor...');

function stripHTML(html){
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildHTML(title, bodyHTML){
  return '<!doctype html><html lang="tr"><head><meta charset="utf-8">' +
    '<title>' + title + '</title>' +
    '<style>' +
    'body{font-family:-apple-system,"Segoe UI",sans-serif;max-width:760px;margin:30px auto;padding:20px;color:#1f1a14;line-height:1.6;font-size:14px}' +
    'h1{color:#8a6200;border-bottom:2px solid #f6d17b;padding-bottom:10px;font-family:Georgia,serif;font-size:22px;margin:0 0 8px}' +
    '.meta{font-size:11px;color:#888;margin-bottom:24px}' +
    'h2{color:#333;margin-top:28px;font-size:17px;border-left:4px solid #a78bfa;padding-left:10px;font-family:Georgia,serif}' +
    '.note{margin-bottom:26px;page-break-inside:avoid}' +
    '.note-body{white-space:pre-wrap;color:#333}' +
    '.msg{margin-bottom:14px;padding:10px 14px;border-radius:10px;page-break-inside:avoid}' +
    '.msg.user{background:#f0e9d8;margin-left:20%}' +
    '.msg.bot{background:#fffdf7;border:1px solid #e8dcc0}' +
    '.msg .who{font-size:11px;color:#888;margin-bottom:4px;font-weight:600}' +
    'pre{background:#f5f0e3;padding:10px;border-radius:6px;overflow-x:auto;font-size:12px;border:1px solid #e8dcc0}' +
    'code{background:#f0f2ed;padding:1px 4px;border-radius:3px;font-size:12.5px}' +
    '.footer{text-align:center;color:#888;font-size:11px;margin-top:40px;padding-top:16px;border-top:1px solid #ddd}' +
    '@media print{body{margin:0;padding:15px}h2{page-break-after:avoid}}' +
    '</style></head><body>' +
    '<h1>' + title + '</h1>' +
    '<div class="meta">' + new Date().toLocaleString('tr-TR') + ' · ÖZnur Eğitim</div>' +
    bodyHTML +
    '<div class="footer">ÖZnur Eğitim · oznur-egitim · ' + S.progress.xp + ' XP · 🔥 ' + S.progress.streak + ' gün seri</div>' +
    '</body></html>';
}

function openPrintWindow(html){
  const w = window.open('', '_blank');
  if(!w){ U.toast('Popup engellendi — izin ver'); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ try { w.print(); } catch(e){} }, 400);
}

/* ═══ NOTLAR PDF ═══ */
OZ.exportNotesPDF = function(){
  const notes = S.notes;
  if(!notes || !notes.length){ U.toast('Not yok'); return; }

  let body = '';
  notes.forEach(function(n){
    body += '<div class="note">' +
      '<h2>' + U.esc(n.title) + '</h2>' +
      '<div class="note-body">' + U.esc(n.body) + '</div>' +
    '</div>';
  });

  const html = buildHTML('📝 Notlarım (' + notes.length + ')', body);
  openPrintWindow(html);
  U.toast('Yazdırma penceresi açıldı');
};

/* ═══ SOHBET PDF ═══ */
OZ.exportChatPDF = function(){
  const chat = S.chat.filter(function(m){ return m.role === 'user' || m.role === 'bot'; });
  if(!chat.length){ U.toast('Sohbet boş'); return; }

  let body = '';
  chat.forEach(function(m){
    const who = m.role === 'user' ? '👤 SEN' : '🤖 HOCA';
    body += '<div class="msg ' + m.role + '">' +
      '<div class="who">' + who + '</div>' +
      '<div>' + m.html.replace(/<script[\s\S]*?<\/script>/gi,'') + '</div>' +
    '</div>';
  });

  const html = buildHTML('💬 Sohbet Geçmişi (' + chat.length + ' mesaj)', body);
  openPrintWindow(html);
  U.toast('Yazdırma penceresi açıldı');
};

/* ═══ NOTLAR MODALINA PDF BUTONU EKLE ═══ */
const _showNotes = OZ.showNotes;
OZ.showNotes = function(){
  _showNotes.call(this);
  setTimeout(function(){
    const modal = $('modal-content');
    if(!modal || modal.querySelector('#notesPdfBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'notesPdfBtn';
    btn.className = 'btn';
    btn.innerHTML = '📄 PDF olarak indir';
    btn.style.marginTop = '6px';
    btn.onclick = OZ.exportNotesPDF;
    const primary = modal.querySelector('.btn.primary');
    if(primary && primary.parentNode) primary.parentNode.insertBefore(btn, primary.nextSibling);
    else modal.appendChild(btn);
  }, 80);
};

/* ═══ PROFİL'E "Sohbeti PDF" EKLE ═══ */
function attachChatPdf(){
  if(S.tab !== 'profile') return;
  const section = document.querySelector('.section');
  if(!section || section.querySelector('[data-chat-pdf]')) return;
  const dataTitle = Array.from(section.querySelectorAll('.section-title')).find(function(el){
    return el.textContent.indexOf('Veri') !== -1;
  });
  if(!dataTitle) return;

  const card = document.createElement('div');
  card.className = 'card clickable';
  card.setAttribute('data-chat-pdf', '1');
  card.innerHTML = '<h4>📄 Sohbeti PDF İndir</h4><p>Tüm konuşmayı PDF olarak kaydet</p>';
  card.onclick = OZ.exportChatPDF;
  dataTitle.parentNode.insertBefore(card, dataTitle.nextSibling);
}

const _render = OZ.render;
OZ.render = function(){
  _render.apply(this, arguments);
  setTimeout(attachChatPdf, 100);
};

setInterval(function(){ if(S.tab === 'profile') attachChatPdf(); }, 500);
setTimeout(attachChatPdf, 400);

console.log('[PDF] hazır');
})();
