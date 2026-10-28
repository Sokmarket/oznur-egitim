/* ÖZnur Eğitim — Araçlar (Bölüm 1/2): Python, Terminal, Regex, JSON */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;

OZ.tools = {};

/* ═══ 1. PYTHON (Pyodide) ═══ */
OZ.tools.python = function(){
  OZ.openModal(
    '<h2>🐍 Python <button onclick="OZ.closeModal()">×</button></h2>' +
    '<p class="hint">İlk açılışta Pyodide indirilir (~10 MB, internet gerekir). Sonra offline çalışır.</p>' +
    '<textarea id="pyCode" style="min-height:160px;font-family:var(--mono);font-size:12.5px">print("Merhaba ÖZnur!")\nfor i in range(3):\n    print("Sayı:", i)</textarea>' +
    '<button class="btn primary" id="pyRun">▶️ Çalıştır</button>' +
    '<button class="btn" id="pyClear" style="margin-top:4px">Temizle</button>' +
    '<div class="out" id="pyOut">Hazır. İlk çalıştırmada Pyodide yüklenecek.</div>'
  );
  const out = $('pyOut'), code = $('pyCode');
  $('pyClear').onclick = function(){ out.textContent = 'Temizlendi.'; };
  $('pyRun').onclick = async function(){
    if(!S.pyodide){
      out.textContent = '⏳ Pyodide yükleniyor… (10-20 sn)';
      try {
        if(!window.loadPyodide){
          await new Promise(function(res, rej){
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
            s.onload = res;
            s.onerror = function(){ rej(new Error('CDN yüklenemedi')); };
            document.head.appendChild(s);
          });
        }
        S.pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
        out.textContent = '✅ Pyodide hazır.\n';
      } catch(e){
        out.textContent = '❌ Yüklenemedi (internet gerekli): ' + e.message;
        return;
      }
    }
    out.textContent = '';
    let buf = '';
    try {
      S.pyodide.setStdout({ batched: function(s){ buf += s + '\n'; out.textContent = buf; } });
      S.pyodide.setStderr({ batched: function(s){ buf += '⚠️ ' + s + '\n'; out.textContent = buf; } });
      await S.pyodide.runPythonAsync(code.value);
      if(!buf) out.textContent = '(çıktı yok — kod çalıştı)';
    } catch(e){
      out.textContent = buf + '\n❌ ' + e.message;
    }
  };
};

/* ═══ 2. TERMİNAL SİMÜLATÖRÜ ═══ */
OZ.tools.terminal = function(){
  OZ.openModal(
    '<h2>💻 Terminal <button onclick="OZ.closeModal()">×</button></h2>' +
    '<p class="hint">Eğitim amaçlı simülatör. Gerçek dosya sistemine dokunmaz. <code>help</code> yazın.</p>' +
    '<div class="tool-area" id="termArea" style="min-height:220px;max-height:340px;overflow-y:auto;font-family:var(--mono);font-size:12.5px;padding:10px;background:var(--bg)"></div>' +
    '<div class="term-input-row">' +
      '<input id="termCmd" placeholder="komut yaz (help)" autocomplete="off" autocorrect="off" autocapitalize="off">' +
      '<button id="termSend">→</button>' +
    '</div>' +
    '<button class="btn" id="termClear" style="margin-top:6px">Ekranı Temizle</button>'
  );
  const area = $('termArea');
  const vfs = S.vfs;

  function print(html, cls){
    const line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.innerHTML = html;
    area.appendChild(line);
    area.scrollTop = area.scrollHeight;
  }
  function promptStr(){
    const cwd = vfs.cwd.replace(/^\/home/, '~');
    return '<span class="path">' + U.esc(cwd) + '</span>$ ';
  }
  function resolve(p){
    if(!p) return vfs.cwd;
    if(p.charAt(0) === '/') return p;
    if(p === '~') return '/home';
    if(p === '..'){
      const parts = vfs.cwd.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    if(p === '.') return vfs.cwd;
    return (vfs.cwd === '/' ? '' : vfs.cwd) + '/' + p;
  }
  function listDir(p){
    const prefix = p === '/' ? '/' : p + '/';
    const items = [];
    Object.keys(vfs.files).forEach(function(f){
      if(f.indexOf(prefix) === 0){
        const rest = f.slice(prefix.length);
        const first = rest.split('/')[0];
        if(first && items.indexOf(first) === -1) items.push(first);
      }
    });
    items.sort();
    return items;
  }

  function run(cmd){
    print(promptStr() + U.esc(cmd));
    const parts = cmd.trim().split(/\s+/);
    const c = parts[0] || '';
    const args = parts.slice(1);

    try {
      switch(c){
        case '':
          break;
        case 'help':
          print('Komutlar: ls, cd, pwd, cat, touch, mkdir, rm, echo, clear, whoami, tree, find, date');
          break;
        case 'pwd':
          print(U.esc(vfs.cwd));
          break;
        case 'whoami':
          print('oznur');
          break;
        case 'date':
          print(new Date().toLocaleString('tr-TR'));
          break;
        case 'ls': {
          const p = resolve(args[0] || '');
          const items = listDir(p);
          if(!items.length) print('(boş)', 'err');
          else {
            const out2 = items.map(function(x){
              const full = (p === '/' ? '' : p) + '/' + x;
              const isDir = Object.keys(vfs.files).some(function(f){ return f.indexOf(full + '/') === 0; });
              return isDir ? '<span class="path">' + U.esc(x) + '/</span>' : U.esc(x);
            }).join('  ');
            print(out2);
          }
          break;
        }
        case 'cd': {
          const p = resolve(args[0] || '/home');
          if(p === '/home' || p === '/' || listDir(p).length || Object.keys(vfs.files).some(function(f){ return f.indexOf(p) === 0; })){
            vfs.cwd = p;
            OZ.storage.set('vfs', vfs);
          } else print('cd: ' + U.esc(p) + ': dizin yok', 'err');
          break;
        }
        case 'cat': {
          if(!args[0]){ print('cat: dosya adı gerekli', 'err'); break; }
          const p = resolve(args[0]);
          if(vfs.files[p] !== undefined) print(U.esc(vfs.files[p]) || '(boş dosya)');
          else print('cat: ' + U.esc(p) + ': bulunamadı', 'err');
          break;
        }
        case 'touch': {
          if(!args[0]){ print('touch: dosya adı gerekli', 'err'); break; }
          const p = resolve(args[0]);
          vfs.files[p] = vfs.files[p] || '';
          OZ.storage.set('vfs', vfs);
          break;
        }
        case 'mkdir': {
          if(!args[0]){ print('mkdir: dizin adı gerekli', 'err'); break; }
          const p = resolve(args[0]);
          vfs.files[p + '/.keep'] = '';
          OZ.storage.set('vfs', vfs);
          break;
        }
        case 'rm': {
          if(!args[0]){ print('rm: dosya adı gerekli', 'err'); break; }
          const p = resolve(args[0]);
          const match = Object.keys(vfs.files).filter(function(f){ return f === p || f.indexOf(p + '/') === 0; });
          if(!match.length) print('rm: ' + U.esc(p) + ': bulunamadı', 'err');
          else { match.forEach(function(f){ delete vfs.files[f]; }); OZ.storage.set('vfs', vfs); }
          break;
        }
        case 'echo':
          print(U.esc(args.join(' ')));
          break;
        case 'tree': {
          const p = resolve(args[0] || '');
          const items = listDir(p);
          if(!items.length) print('(boş)', 'err');
          else items.forEach(function(x){
            const full = (p === '/' ? '' : p) + '/' + x;
            const isDir = Object.keys(vfs.files).some(function(f){ return f.indexOf(full + '/') === 0; });
            print((isDir ? '📁 ' : '📄 ') + '<span class="' + (isDir ? 'path' : '') + '">' + U.esc(x) + '</span>');
          });
          break;
        }
        case 'find': {
          if(!args[0]){ print('find: kelime gerekli', 'err'); break; }
          const q = args[0].toLowerCase();
          const found = Object.keys(vfs.files).filter(function(f){ return f.toLowerCase().indexOf(q) !== -1; });
          if(!found.length) print('(sonuç yok)', 'err');
          else found.forEach(function(f){ print(U.esc(f)); });
          break;
        }
        case 'clear':
          area.innerHTML = '';
          break;
        case 'sudo':
          print('sudo: bu simülatörde yok', 'err');
          break;
        default:
          print(c + ': komut bulunamadı. "help" yazın.', 'err');
      }
    } catch(err){
      print('Hata: ' + U.esc(err.message), 'err');
    }
  }

  print('<span style="color:var(--muted)">ÖZnur Eğitim Terminali · "help" yazın</span>');
  print('<span style="color:var(--muted)">Dizin: ~/ (ev) · vfs kalıcı</span>');
  print('');

  const input = $('termCmd');
  $('termSend').onclick = function(){
    const v = input.value;
    if(!v.trim()) return;
    input.value = '';
    run(v);
  };
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter') $('termSend').click();
  });
  $('termClear').onclick = function(){ area.innerHTML = ''; };
  setTimeout(function(){ input.focus(); }, 50);
};

/* ═══ 3. REGEX TEST ═══ */
OZ.tools.regex = function(){
  OZ.openModal(
    '<h2>🔍 Regex Test <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Desen</label>' +
    '<input type="text" id="rxPattern" value="\\d+" placeholder="\\d+">' +
    '<label>Bayraklar</label>' +
    '<div class="seg" id="rxFlags">' +
      '<button data-flag="g" class="on">g</button>' +
      '<button data-flag="i">i</button>' +
      '<button data-flag="m">m</button>' +
    '</div>' +
    '<label>Test metni</label>' +
    '<textarea id="rxText" style="min-height:100px">Bugün 15 derece, yarın 18 olacak.</textarea>' +
    '<button class="btn primary" id="rxRun">Eşleştir</button>' +
    '<div class="out" id="rxOut"></div>' +
    '<p class="hint" style="margin-top:10px">\\d rakam · \\w harf/rakam · \\s boşluk · . her şey · + 1+ · * 0+ · ? 0/1</p>'
  );

  let flags = 'g';
  $('rxFlags').onclick = function(e){
    const b = e.target.closest('button');
    if(!b) return;
    b.classList.toggle('on');
    flags = Array.from(document.querySelectorAll('#rxFlags button.on')).map(function(x){ return x.dataset.flag; }).join('');
  };

  $('rxRun').onclick = function(){
    try {
      const pat = $('rxPattern').value;
      const re = new RegExp(pat, flags);
      const text = $('rxText').value;
      const matches = Array.from(text.matchAll(re));
      if(!matches.length){
        $('rxOut').textContent = 'Sonuç: eşleşme yok';
        return;
      }
      let out = 'Bulunan: ' + matches.length + ' eşleşme\n\n';
      matches.forEach(function(m, i){
        out += '[' + i + '] "' + m[0] + '" @ index ' + m.index;
        if(m.length > 1){
          out += '\n     gruplar: ' + m.slice(1).map(function(g){ return JSON.stringify(g); }).join(', ');
        }
        out += '\n';
      });
      $('rxOut').textContent = out;
    } catch(e){
      $('rxOut').textContent = '❌ Desen hatası: ' + e.message;
    }
  };
  $('rxRun').click();
};

/* ═══ 4. JSON BİÇİMLENDİRİCİ ═══ */
OZ.tools.json = function(){
  OZ.openModal(
    '<h2>🧾 JSON <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>JSON</label>' +
    '<textarea id="jsonInput" style="min-height:150px">{"ad":"Ali","yas":25,"hobiler":["kod","kitap"]}</textarea>' +
    '<button class="btn primary" id="jsonFormat">Biçimlendir</button>' +
    '<button class="btn" id="jsonMinify">Küçült</button>' +
    '<div class="out" id="jsonOut"></div>'
  );
  const inp = $('jsonInput'), out = $('jsonOut');
  $('jsonFormat').onclick = function(){
    try { out.textContent = JSON.stringify(JSON.parse(inp.value), null, 2); }
    catch(e){ out.textContent = '❌ Geçersiz JSON: ' + e.message; }
  };
  $('jsonMinify').onclick = function(){
    try { out.textContent = JSON.stringify(JSON.parse(inp.value)); }
    catch(e){ out.textContent = '❌ Geçersiz JSON: ' + e.message; }
  };
};

/* NOT: Bölüm 2 devam edecek — md, snippets, docs, color */

/* ═══ 5. MARKDOWN ÖNİZLEME ═══ */
OZ.tools.md = function(){
  OZ.openModal(
    '<h2>📝 Markdown <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Markdown</label>' +
    '<textarea id="mdInput" style="min-height:150px"># Başlık\n\n**Kalın**, *italik*, `kod`\n\n- Liste 1\n- Liste 2\n\n```python\nprint("Merhaba")\n```</textarea>' +
    '<button class="btn primary" id="mdPreview">Önizle</button>' +
    '<div id="mdOut" style="margin-top:10px;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;max-height:260px;overflow-y:auto"></div>'
  );
  $('mdPreview').onclick = function(){
    $('mdOut').innerHTML = OZ.formatAI($('mdInput').value);
  };
  $('mdPreview').click();
};

/* ═══ 6. SNIPPET'LER ═══ */
OZ.tools.snippets = function(){
  let list;
  if(!S.snippets.length){
    list = '<p class="hint">Henüz snippet yok.</p>';
  } else {
    list = S.snippets.map(function(s){
      return '<div class="card">' +
        '<h4>' + U.esc(s.title) + '</h4>' +
        '<pre style="background:var(--bg);padding:8px;border-radius:6px;font-size:11.5px;overflow-x:auto;margin:6px 0;white-space:pre-wrap">' + U.esc(s.code) + '</pre>' +
        '<div style="display:flex;gap:4px">' +
          '<button class="chip" onclick="OZ.copySnippet(\'' + s.id + '\')">📋 Kopyala</button>' +
          '<button class="chip" onclick="OZ.delSnippet(\'' + s.id + '\')">🗑️ Sil</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }
  OZ.openModal(
    '<h2>📋 Snippet\'ler <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Başlık</label>' +
    '<input type="text" id="snTitle" placeholder="Örn: Dosya oku">' +
    '<label>Kod</label>' +
    '<textarea id="snCode" style="min-height:100px;font-family:var(--mono);font-size:12px" placeholder="with open(\'a.txt\') as f:\n    print(f.read())"></textarea>' +
    '<button class="btn primary" id="snAdd">+ Ekle</button>' +
    '<div style="margin-top:14px">' + list + '</div>'
  );
  $('snAdd').onclick = function(){
    const t = $('snTitle').value.trim();
    const c = $('snCode').value.trim();
    if(!t || !c) return U.toast('Başlık ve kod gerekli');
    S.snippets.push({ id: U.uid(), title: t, code: c, ts: Date.now() });
    OZ.storage.set('snippets', S.snippets);
    U.toast('Eklendi ✓');
    OZ.tools.snippets();
  };
};

OZ.delSnippet = function(id){
  S.snippets = S.snippets.filter(function(s){ return s.id !== id; });
  OZ.storage.set('snippets', S.snippets);
  OZ.tools.snippets();
};

OZ.copySnippet = async function(id){
  const s = S.snippets.find(function(x){ return x.id === id; });
  if(!s) return;
  try {
    await navigator.clipboard.writeText(s.code);
    U.toast('Kopyalandı ✓');
  } catch(e){
    U.toast('Kopyalanamadı');
  }
};

/* ═══ 7. DOKÜMAN GEZGİNİ ═══ */
OZ.tools.docs = function(){
  let list;
  if(!S.docs.length){
    list = '<p class="hint">Henüz doküman yok. Telefonundaki .txt, .md, .html dosyalarını ekle.</p>';
  } else {
    list = S.docs.map(function(d){
      return '<div class="card">' +
        '<h4>' + U.esc(d.title) + '</h4>' +
        '<p style="font-size:11.5px">' + d.text.length.toLocaleString('tr-TR') + ' karakter</p>' +
        '<div style="margin-top:6px">' +
          '<button class="chip" onclick="OZ.searchDoc(\'' + d.id + '\')">🔍 İçinde Ara</button>' +
          '<button class="chip" onclick="OZ.delDoc(\'' + d.id + '\')">🗑️ Sil</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }
  OZ.openModal(
    '<h2>📖 Dokümanlar <button onclick="OZ.closeModal()">×</button></h2>' +
    '<p class="hint">Telefonundaki .txt, .md, .html dosyalarını ekle. Metin çıkarılır, aranabilir hale gelir.</p>' +
    '<input type="file" id="docFile" accept=".txt,.md,.html,.htm,.py" multiple>' +
    '<label style="margin-top:10px">Tüm Dokümanlarda Ara</label>' +
    '<input type="text" id="docSearch" placeholder="kelime yaz…">' +
    '<div id="docResults" style="margin-top:8px"></div>' +
    '<div style="margin-top:14px">' + list + '</div>'
  );
  $('docFile').onchange = async function(e){
    const files = e.target.files;
    let added = 0;
    for(let i = 0; i < files.length; i++){
      try {
        const f = files[i];
        const text = await f.text();
        let clean = text;
        if(/\.(html|htm)$/i.test(f.name)){
          clean = text.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ');
        }
        S.docs.push({ id: U.uid(), title: f.name, text: clean.slice(0, 500000), ts: Date.now() });
        added++;
      } catch(err){
        console.warn('Dosya okunamadı:', files[i].name, err);
      }
    }
    OZ.storage.set('docs', S.docs);
    U.toast(added + ' doküman eklendi ✓');
    OZ.tools.docs();
  };
  $('docSearch').oninput = function(e){
    const q = U.norm(e.target.value);
    const results = $('docResults');
    if(!q || q.length < 2){ results.innerHTML = ''; return; }
    const hits = [];
    S.docs.forEach(function(d){
      const haystack = U.norm(d.text);
      let idx = haystack.indexOf(q);
      while(idx !== -1 && hits.length < 20){
        const start = Math.max(0, idx - 50);
        const end = Math.min(d.text.length, idx + q.length + 80);
        hits.push({ title: d.title, snippet: '…' + d.text.slice(start, end) + '…' });
        idx = haystack.indexOf(q, idx + 1);
      }
    });
    if(!hits.length){
      results.innerHTML = '<p class="hint">Sonuç yok.</p>';
      return;
    }
    results.innerHTML = hits.map(function(h){
      return '<div class="card"><h4>' + U.esc(h.title) + '</h4><p style="font-size:11.5px">' + U.esc(h.snippet) + '</p></div>';
    }).join('');
  };
};

OZ.delDoc = function(id){
  S.docs = S.docs.filter(function(d){ return d.id !== id; });
  OZ.storage.set('docs', S.docs);
  OZ.tools.docs();
};

OZ.searchDoc = function(id){
  const d = S.docs.find(function(x){ return x.id === id; });
  if(!d) return;
  OZ.openModal(
    '<h2>🔍 ' + U.esc(d.title) + ' <button onclick="OZ.closeModal()">×</button></h2>' +
    '<input type="text" id="singleDocSearch" placeholder="kelime yaz…">' +
    '<div class="out" id="singleDocOut" style="max-height:400px;margin-top:10px">Yazmaya başla…</div>'
  );
  $('singleDocSearch').oninput = function(e){
    const q = U.norm(e.target.value);
    if(!q || q.length < 2){ $('singleDocOut').textContent = 'En az 2 karakter yaz.'; return; }
    const haystack = U.norm(d.text);
    const hits = [];
    let idx = haystack.indexOf(q);
    while(idx !== -1 && hits.length < 30){
      const start = Math.max(0, idx - 60);
      const end = Math.min(d.text.length, idx + q.length + 100);
      hits.push('…' + d.text.slice(start, end) + '…');
      idx = haystack.indexOf(q, idx + 1);
    }
    $('singleDocOut').textContent = hits.length ? hits.join('\n\n─────\n\n') : 'Sonuç yok.';
  };
  setTimeout(function(){ $('singleDocSearch').focus(); }, 50);
};

/* ═══ 8. RENK SEÇİCİ ═══ */
OZ.tools.color = function(){
  OZ.openModal(
    '<h2>🎨 Renk Seçici <button onclick="OZ.closeModal()">×</button></h2>' +
    '<input type="color" id="colPick" value="#a78bfa" style="width:100%;height:80px;border-radius:12px;border:1px solid var(--border);cursor:pointer">' +
    '<label style="margin-top:10px">Önizleme</label>' +
    '<div id="colPreview" style="height:60px;border-radius:10px;border:1px solid var(--border);margin-bottom:10px;display:grid;place-items:center;font-weight:700">ÖZnur</div>' +
    '<div class="out" id="colOut"></div>' +
    '<button class="btn primary" id="colCopy">📋 Değerleri Kopyala</button>'
  );
  const update = function(){
    const c = $('colPick').value;
    const r = parseInt(c.slice(1,3), 16);
    const g = parseInt(c.slice(3,5), 16);
    const b = parseInt(c.slice(5,7), 16);
    const hsl = rgbToHsl(r, g, b);
    $('colPreview').style.background = c;
    $('colPreview').style.color = (r*0.299 + g*0.587 + b*0.114) > 140 ? '#000' : '#fff';
    $('colOut').textContent =
      'HEX: ' + c.toUpperCase() + '\n' +
      'RGB: rgb(' + r + ', ' + g + ', ' + b + ')\n' +
      'HSL: hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)\n\n' +
      'CSS: background: ' + c + ';\n' +
      'CSS: color: ' + c + ';';
  };
  function rgbToHsl(r, g, b){
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if(max !== min){
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if(max === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if(max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
  }
  $('colPick').oninput = update;
  $('colCopy').onclick = async function(){
    try {
      await navigator.clipboard.writeText($('colOut').textContent);
      U.toast('Kopyalandı ✓');
    } catch(e){ U.toast('Kopyalanamadı'); }
  };
  update();
};

console.log('[Tools] yüklendi: 8 araç');
})();
