/* ÖZnur Eğitim — Görünümler: Sohbet, Öğren, Araçlar, Profil, Ayarlar */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;

/* ═══════════════ CHAT YARDIMCILARI ═══════════════ */
OZ.addMsg = function(html, role){
  S.chat.push({ role: role, html: html, ts: Date.now() });
  if(S.chat.length > 200) S.chat = S.chat.slice(-200);
  OZ.storage.set('chat', S.chat);
  const list = $('chatList');
  if(list){
    const d = document.createElement('div');
    d.className = 'msg ' + role;
    d.innerHTML = html;
    list.appendChild(d);
    list.scrollTop = list.scrollHeight;
  }
};

OZ.showTyping = function(){
  const list = $('chatList');
  if(!list) return;
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.id = 'typing';
  d.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  list.appendChild(d);
  list.scrollTop = list.scrollHeight;
};

OZ.removeTyping = function(){
  const t = $('typing');
  if(t) t.remove();
};

OZ.botSay = async function(html, delay){
  OZ.showTyping();
  const d = (delay != null) ? delay : (300 + Math.min(900, html.length / 3));
  await new Promise(function(r){ setTimeout(r, d); });
  OZ.removeTyping();
  OZ.addMsg(html, 'bot');
};

/* ═══════════════ SOHBET GÖRÜNÜMÜ ═══════════════ */
OZ.views.chat = function(container){
  container.innerHTML =
    '<div class="chat-wrap">' +
      '<div class="chat-list" id="chatList"></div>' +
      '<div class="chips" id="chips"></div>' +
    '</div>' +
    '<div class="composer" style="position:sticky;bottom:0;background:var(--bg);padding-top:4px">' +
      '<textarea id="msgInput" rows="1" placeholder="Bir konu sor: \'değişken nedir\', \'for döngüsü\', \'quiz başlat\'..."></textarea>' +
      '<button class="send" id="sendBtn" aria-label="Gönder">➤</button>' +
    '</div>';

  const list = $('chatList');
  S.chat.forEach(function(m){
    const d = document.createElement('div');
    d.className = 'msg ' + m.role;
    d.innerHTML = m.html;
    list.appendChild(d);
  });
  list.scrollTop = list.scrollHeight;

  const chips = [
    ['Değişken','değişken nedir'],['For','for döngüsü'],
    ['Liste','liste'],['Sözlük','sözlük'],['Fonksiyon','fonksiyon'],
    ['OOP','sınıf'],['RAM','ram'],['Termux','termux'],
    ['Git','git'],['Quiz','quiz başlat'],['Konular','konular'],['Yardım','yardım']
  ];
  const chipsEl = $('chips');
  chips.forEach(function(pair){
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = pair[0];
    b.onclick = function(){ $('msgInput').value = pair[1]; OZ.sendMessage(); };
    chipsEl.appendChild(b);
  });

  const input = $('msgInput'), sendBtn = $('sendBtn');
  input.addEventListener('input', function(){
    input.style.height = 'auto';
    input.style.height = Math.min(120, input.scrollHeight) + 'px';
  });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); OZ.sendMessage(); }
  });
  sendBtn.onclick = OZ.sendMessage;
};

/* ═══════════════ MESAJ GÖNDERME ═══════════════ */
OZ.sendMessage = function(){
  const input = $('msgInput');
  if(!input) return;
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  input.style.height = 'auto';
  OZ.addMsg(U.esc(text).replace(/\n/g, '<br>'), 'user');
  S.progress.askCount++;
  OZ.saveProgress();
  OZ.checkStreak();
  OZ.handleUserText(text);
};

OZ.handleUserText = async function(text){
  const n = U.norm(text);

  if(S.quiz.active){
    if(['a','b','c','d'].indexOf(n) !== -1) return OZ.answerQuiz(n);
    if(n.indexOf('iptal') !== -1 || n.indexOf('cik') !== -1){
      S.quiz.active = false;
      return OZ.botSay('<p>Quiz iptal edildi.</p>');
    }
    return OZ.botSay('<p>Quiz modundasın. A/B/C/D yaz veya "iptal".</p>');
  }

  if(/^(merhaba|selam|hey|hi|alo|günaydın|iyi akşamlar|slm|meraba)$/.test(n)){
    return OZ.botSay('<h3>Merhaba! 👋</h3>' +
      '<p>Ben <b>ÖZnur Eğitim</b> asistanıyım. Ne öğrenmek istersin?</p>' +
      '<ul><li>Konu sor: <code>değişken nedir</code>, <code>for döngüsü</code></li>' +
      '<li><code>quiz başlat</code> — seni sınava sokayım</li>' +
      '<li><code>konular</code> — tüm müfredat</li></ul>');
  }
  if(/^(görüşürüz|hoşçakal|bay|kapat|çık|exit|bye)$/.test(n)){
    return OZ.botSay('<p>Görüşürüz! 👋</p>');
  }
  if(n.indexOf('teşekkür') !== -1 || n.indexOf('sağol') !== -1 || n.indexOf('eyvallah') !== -1){
    return OZ.botSay('<p>Rica ederim! 🙏</p>');
  }
  if(/^(yardım|help|ne yapabilirsin|komutlar|menü)$/.test(n)){
    return OZ.botSay('<h3>🧭 Komutlar</h3>' +
      '<p><b>Konu:</b> <code>değişken</code>, <code>for</code>, <code>ram</code>, <code>oop</code>, <code>git</code>, <code>sql</code></p>' +
      '<p><b>Quiz:</b> <code>quiz başlat</code></p>' +
      '<p><b>Müfredat:</b> <code>konular</code></p>');
  }
  if(n.indexOf('quiz') !== -1 || n === 'sınav' || n === 'test'){
    return OZ.startQuiz();
  }
  if(n === 'konular' || n === 'liste' || n === 'müfredat'){
    return OZ.listTopics();
  }

  const topic = OZ.findTopic(text);
  if(topic){
    S.progress.xp += 5;
    OZ.saveProgress();
    OZ.checkStreak();
    return OZ.botSay('<h3>📘 ' + U.esc(topic.title) + '</h3>' + topic.body +
      '<div class="msg-meta">' + U.esc(topic.cat) + ' · Yerel</div>');
  }

  if(OZ.aiActive()){
    OZ.showTyping();
    const messages = [{ role: 'system', content: OZ.aiSystemPrompt() }];
    S.chat.slice(-6).forEach(function(m){
      if(m.role === 'user' || m.role === 'bot'){
        messages.push({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
        });
      }
    });
    const reply = await OZ.askAI(messages);
    OZ.removeTyping();
    if(reply){
      S.progress.xp += 3;
      OZ.saveProgress();
      return OZ.addMsg(OZ.formatAI(reply), 'bot');
    }
  }

  OZ.botSay('<h3>🤔 Bunu tam anlayamadım</h3>' +
    '<p>"' + U.esc(text) + '" için kayıt bulamadım.</p>' +
    '<ul><li>Konuyu tek kelimeyle yaz: <code>değişken</code>, <code>for</code></li>' +
    '<li><code>konular</code> — tüm liste</li>' +
    '<li><code>yardım</code> — komutlar</li>' +
    (OZ.aiActive() ? '' : '<li>💡 Ayarlardan AI anahtarı gir → daha güçlü yanıt</li>') +
    '</ul>');
};

OZ.listTopics = function(){
  const groups = {};
  OZ.KB.forEach(function(t){
    if(!groups[t.cat]) groups[t.cat] = [];
    groups[t.cat].push(t);
  });
  let html = '<h3>📚 ' + OZ.KB.length + ' Konu</h3>';
  Object.keys(groups).forEach(function(cat){
    html += '<p><b>' + U.esc(cat) + '</b></p><ul>';
    groups[cat].forEach(function(t){ html += '<li>' + U.esc(t.title) + '</li>'; });
    html += '</ul>';
  });
  OZ.botSay(html);
};

/* ═══════════════ QUIZ ═══════════════ */
OZ.startQuiz = function(cat){
  const all = OZ.QUIZ.map(function(_, i){ return i; });
  const order = cat && OZ.shuffleQuizCat ? OZ.shuffleQuizCat(cat) : (OZ.shuffleQuiz ? OZ.shuffleQuiz() : all.sort(function(){ return Math.random() - 0.5; }));
  S.quiz = { active: true, index: 0, score: 0, order: order };
  OZ.botSay('<h3>🎯 Quiz Başladı!</h3><p>' + S.quiz.order.length + ' soru. A/B/C/D ile cevapla. Çıkmak için <code>iptal</code>.</p>')
    .then(OZ.showQuestion);
};

OZ.showQuestion = function(){
  const idx = S.quiz.order[S.quiz.index];
  const q = OZ.QUIZ[idx];
  if(!q) return;
  const L = ['A','B','C','D'];
  let html = '<h3>Soru ' + (S.quiz.index + 1) + ' / ' + S.quiz.order.length + '</h3>';
  html += '<p style="font-size:12px;color:var(--muted)">' + U.esc(q.tip || '') + '</p>';
  html += '<p><b>' + U.esc(q.q) + '</b></p><ul>';
  q.opts.forEach(function(o, i){ html += '<li><b>' + L[i] + ')</b> ' + U.esc(o) + '</li>'; });
  html += '</ul><p style="font-size:12px"><i>A/B/C/D yaz.</i></p>';
  OZ.botSay(html);
};

OZ.answerQuiz = function(letter){
  const idx = S.quiz.order[S.quiz.index];
  const q = OZ.QUIZ[idx];
  const map = { a: 0, b: 1, c: 2, d: 3 };
  const chosen = map[letter];
  const correct = chosen === q.ans;
  const L = ['A','B','C','D'];
  if(correct) S.quiz.score++;
  S.progress.quizTotal++;
  if(correct) S.progress.quizCorrect++;
  if(correct) S.progress.xp += 10;
  OZ.saveProgress();
  OZ.checkStreak();
  const fb = correct
    ? '<p style="color:var(--success)">✅ Doğru!</p>'
    : '<p style="color:var(--danger)">❌ Yanlış. Doğru: <b>' + L[q.ans] + ')</b> ' + U.esc(q.opts[q.ans]) + '</p>';
  OZ.botSay(fb).then(function(){
    S.quiz.index++;
    if(S.quiz.index >= S.quiz.order.length){
      S.quiz.active = false;
      const total = S.quiz.order.length;
      const pct = Math.round(S.quiz.score / total * 100);
      const msg = pct >= 80 ? 'Harika! 🎉' : pct >= 50 ? 'Fena değil 💪' : 'Biraz daha çalışalım 📚';
      if(pct >= 80) OZ.unlockBadge('quiz_master');
      OZ.saveProgress();
      OZ.botSay('<h3>🏁 Quiz Bitti</h3><p>Skor: <b>' + S.quiz.score + '/' + total + '</b> (%' + pct + ')</p><p>' + msg + '</p><p style="font-size:12px;color:var(--muted)">Yeniden: <code>quiz başlat</code></p>');
    } else {
      OZ.showQuestion();
    }
  });
};

/* ═══════════════ ÖĞREN ═══════════════ */
OZ.views.learn = function(container){
  const cats = [];
  OZ.KB.forEach(function(t){ if(cats.indexOf(t.cat) === -1) cats.push(t.cat); });
  const dueCards = S.cards.filter(function(c){ return new Date(c.due || 0) <= new Date(); }).length;

  let html = '<div class="section">';
  html += '<div class="section-title">📚 Öğrenme Yolculuğu</div>';
  html += '<div class="grid2">' +
    '<div class="stat-box"><div class="num">' + OZ.KB.length + '</div><div class="lbl">Konu</div></div>' +
    '<div class="stat-box"><div class="num">' + OZ.QUIZ.length + '</div><div class="lbl">Quiz</div></div>' +
    '</div>';
  html += '<div class="section-title" style="margin-top:16px">🎯 Quiz</div>';
  html += '<div class="card clickable" data-action="quiz"><h4>Karışık Quiz Başlat</h4><p>' + OZ.QUIZ.length + ' soru · tüm kategoriler</p></div>';
  html += '<div class="section-title">🃏 Kartlar</div>';
  html += '<div class="card clickable" data-action="cards"><h4>Kart Deste (' + S.cards.length + ')</h4><p>' + dueCards + ' kart bugün tekrar bekliyor</p></div>';
  html += '<div class="card clickable" data-action="autoCards"><h4>📚 KB\'den Kart Üret</h4><p>Tüm konuları kartlara dönüştür</p></div>';
  html += '<div class="section-title">📝 Notlar (' + S.notes.length + ')</div>';
  html += '<div class="card clickable" data-action="notes"><h4>Notlarım</h4><p>Markdown destekli notlar</p></div>';
  html += '<div class="card clickable" data-action="newNote"><h4>+ Yeni Not</h4><p>Hızlı not ekle</p></div>';
  html += '<div class="section-title">🗂️ Kategoriler <small>' + cats.length + '</small></div>';
  cats.forEach(function(cat){
    const count = OZ.KB.filter(function(t){ return t.cat === cat; }).length;
    html += '<div class="card clickable" data-action="showCat" data-arg="' + U.esc(cat) + '"><h4>' + U.esc(cat) + '</h4><p>' + count + ' konu</p></div>';
  });
  html += '</div>';
  container.innerHTML = html;

  container.onclick = function(e){
    const t = e.target.closest('[data-action]');
    if(!t) return;
    const act = t.dataset.action;
    if(act === 'quiz'){ S.tab = 'chat'; OZ.render(); setTimeout(OZ.startQuiz, 100); }
    else if(act === 'cards') OZ.showCards();
    else if(act === 'autoCards') OZ.autoCards();
    else if(act === 'notes') OZ.showNotes();
    else if(act === 'newNote') OZ.addNote();
    else if(act === 'showCat') OZ.showCat(t.dataset.arg);
  };
};

OZ.showCat = function(cat){
  const topics = OZ.KB.filter(function(t){ return t.cat === cat; });
  let html = '<h2>' + U.esc(cat) + ' <button onclick="OZ.closeModal()">×</button></h2>';
  topics.forEach(function(t){
    html += '<div class="card clickable" data-topicid="' + t.id + '" style="cursor:pointer"><h4>' + U.esc(t.title) + '</h4><p>' + U.esc(t.keys[0]) + '</p></div>';
  });
  OZ.openModal(html);
  document.querySelectorAll('[data-topicid]').forEach(function(el){
    el.onclick = function(){
      const topic = OZ.KB.find(function(x){ return x.id === el.dataset.topicid; });
      OZ.closeModal();
      S.tab = 'chat';
      OZ.render();
      setTimeout(function(){
        if(topic) OZ.addMsg('<h3>📘 ' + U.esc(topic.title) + '</h3>' + topic.body, 'bot');
      }, 100);
    };
  });
};

/* ═══════════════ ARAÇLAR ═══════════════ */
OZ.views.tools = function(container){
  const items = [
    ['python','🐍','Python','Kod çalıştır'],
    ['terminal','💻','Terminal','Komut simülatörü'],
    ['regex','🔍','Regex','Test et'],
    ['json','🧾','JSON','Biçimlendir'],
    ['md','📝','Markdown','Önizleme'],
    ['snippets','📋',"Snippet'ler", S.snippets.length + ' kayıtlı'],
    ['docs','📖','Dokümanlar', S.docs.length + ' indeksli'],
    ['color','🎨','Renk','Seçici']
  ];
  let html = '<div class="section"><div class="section-title">🧰 Araçlar</div><div class="grid2">';
  items.forEach(function(it){
    html += '<div class="card clickable" data-tool="' + it[0] + '"><h4>' + it[1] + ' ' + U.esc(it[2]) + '</h4><p>' + U.esc(it[3]) + '</p></div>';
  });
  html += '</div></div>';
  container.innerHTML = html;
  container.onclick = function(e){
    const t = e.target.closest('[data-tool]');
    if(!t) return;
    const fn = OZ.tools[t.dataset.tool];
    if(typeof fn === 'function') fn();
    else U.toast('Bu araç henüz yüklenmedi');
  };
};

/* ═══════════════ PROFİL ═══════════════ */
OZ.views.profile = function(container){
  const p = S.progress;
  const acc = p.quizTotal ? Math.round(p.quizCorrect / p.quizTotal * 100) : 0;
  const badges = [
    { id:'first_ask', icon:'💬', name:'İlk Soru', on: p.askCount >= 1 },
    { id:'curious', icon:'🔍', name:'Meraklı', on: p.askCount >= 10 },
    { id:'quiz_first', icon:'🎯', name:'İlk Quiz', on: p.quizTotal >= 1 },
    { id:'quiz_master', icon:'🏆', name:'Quiz Ustası', on: p.badges.indexOf('quiz_master') !== -1 },
    { id:'streak3', icon:'🔥', name:'3 Gün', on: p.streak >= 3 },
    { id:'streak7', icon:'⭐', name:'7 Gün', on: p.streak >= 7 },
    { id:'xp100', icon:'💎', name:'100 XP', on: p.xp >= 100 },
    { id:'xp500', icon:'👑', name:'500 XP', on: p.xp >= 500 }
  ];
  let html = '<div class="section">';
  html += '<div class="section-title">👤 Profil</div>';
  html += '<div class="grid3">' +
    '<div class="stat-box"><div class="num">' + p.xp + '</div><div class="lbl">XP</div></div>' +
    '<div class="stat-box"><div class="num">' + p.streak + '</div><div class="lbl">🔥 Seri</div></div>' +
    '<div class="stat-box"><div class="num">' + acc + '%</div><div class="lbl">Doğruluk</div></div>' +
    '</div>';
  html += '<div class="section-title">🏅 Rozetler</div><div>';
  badges.forEach(function(b){
    html += '<span class="badge ' + (b.on ? 'on' : '') + '">' + b.icon + ' ' + U.esc(b.name) + '</span>';
  });
  html += '</div>';
  html += '<div class="section-title">📊 Aktivite</div>';
  html += '<div class="card"><h4>Toplam Soru: ' + p.askCount + '</h4><p>Quiz: ' + p.quizCorrect + '/' + p.quizTotal + ' doğru</p><p>Konu: ' + OZ.KB.length + ' · Quiz: ' + OZ.QUIZ.length + '</p></div>';
  html += '<div class="section-title">⚙️ Veri</div>';
  html += '<div class="card clickable" data-action="settings"><h4>Ayarları Aç</h4><p>Tema, dil, AI sağlayıcı</p></div>';
  html += '<div class="card clickable" data-action="export"><h4>📤 Verileri Dışa Aktar</h4><p>JSON yedeği indir</p></div>';
  html += '<div class="card clickable" data-action="import"><h4>📥 Verileri İçe Aktar</h4><p>JSON\'dan geri yükle</p></div>';
  html += '<div class="card clickable" data-action="reset" style="border-color:var(--danger)"><h4 style="color:var(--danger)">🗑️ Tümünü Sıfırla</h4><p>Geri alınamaz</p></div>';
  html += '<p style="text-align:center;color:var(--muted);font-size:11px;margin-top:20px">ÖZnur Eğitim · v1.0</p>';
  html += '</div>';
  container.innerHTML = html;
  container.onclick = function(e){
    const t = e.target.closest('[data-action]');
    if(!t) return;
    const act = t.dataset.action;
    if(act === 'settings') OZ.showSettings();
    else if(act === 'export') OZ.exportAll();
    else if(act === 'import') OZ.importData();
    else if(act === 'reset') OZ.resetAll();
  };
};

/* ═══════════════ AYARLAR ═══════════════ */
OZ.showSettings = function(){
  let provOpts = '';
  Object.keys(OZ.PROVIDERS).forEach(function(k){
    const v = OZ.PROVIDERS[k];
    provOpts += '<option value="' + k + '"' + (S.ai.provider === k ? ' selected' : '') + '>' + v.icon + ' ' + v.name + '</option>';
  });
  OZ.openModal(
    '<h2>⚙️ Ayarlar <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Tema</label>' +
    '<div class="seg" id="themeSeg">' +
      '<button data-v="dark" class="' + (S.prefs.theme === 'dark' ? 'on' : '') + '">Koyu</button>' +
      '<button data-v="light" class="' + (S.prefs.theme === 'light' ? 'on' : '') + '">Açık</button>' +
      '<button data-v="sepia" class="' + (S.prefs.theme === 'sepia' ? 'on' : '') + '">Sepya</button>' +
    '</div>' +
    '<label>Yazı boyutu: <span id="fontLabel">' + S.prefs.font + '%</span></label>' +
    '<input type="range" min="85" max="140" step="5" value="' + S.prefs.font + '" id="fontRange">' +
    '<label>Dil</label>' +
    '<select id="langSel">' +
      '<option value="tr"' + (S.prefs.lang === 'tr' ? ' selected' : '') + '>Türkçe</option>' +
      '<option value="az"' + (S.prefs.lang === 'az' ? ' selected' : '') + '>Azərbaycanca</option>' +
      '<option value="en"' + (S.prefs.lang === 'en' ? ' selected' : '') + '>English</option>' +
    '</select>' +
    '<label>AI Sağlayıcı</label>' +
    '<select id="provSel">' + provOpts + '</select>' +
    '<div id="provFields" style="margin-top:8px"></div>' +
    '<button class="btn primary" id="saveSettings">Kaydet</button>' +
    '<p class="hint" style="margin-top:12px">🔒 API anahtarı yalnızca bu cihazda saklanır.</p>'
  );

  OZ.renderProvFields();

  $('themeSeg').onclick = function(e){
    const b = e.target.closest('button');
    if(!b) return;
    S.prefs.theme = b.dataset.v;
    document.querySelectorAll('#themeSeg button').forEach(function(x){
      x.classList.toggle('on', x.dataset.v === S.prefs.theme);
    });
    OZ.applyTheme();
  };

  $('fontRange').oninput = function(e){
    S.prefs.font = +e.target.value;
    $('fontLabel').textContent = S.prefs.font + '%';
    OZ.applyTheme();
  };

  $('provSel').onchange = function(e){
    S.ai.provider = e.target.value;
    OZ.renderProvFields();
  };

  $('saveSettings').onclick = function(){
    S.prefs.lang = $('langSel').value;
    S.ai.provider = $('provSel').value;
    const keyEl = $('aiKey'), modelEl = $('aiModel'), endEl = $('aiEndpoint');
    if(S.ai.provider !== 'none' && S.ai.provider !== 'ollama'){
      if(keyEl) S.ai.key = keyEl.value.trim();
    }
    if(modelEl) S.ai.model = modelEl.value.trim() || (OZ.PROVIDERS[S.ai.provider] || {}).model || '';
    if(S.ai.provider === 'ollama' && endEl){
      S.ai.endpoint = endEl.value.trim() || OZ.PROVIDERS.ollama.url;
    }
    OZ.saveAll();
    OZ.applyTheme();
    OZ.closeModal();
    U.toast('Ayarlar kaydedildi ✓');
    OZ.render();
    if(OZ.aiActive() && OZ.testConnection) OZ.testConnection();
  };
};

OZ.renderProvFields = function(){
  const container = $('provFields');
  if(!container) return;
  const p = OZ.PROVIDERS[S.ai.provider] || OZ.PROVIDERS.none;
  if(S.ai.provider === 'none'){
    container.innerHTML = '<p class="hint">💡 Yerel mod: Sadece bilgi tabanı. Anahtar/internet gerekmez.</p>';
    return;
  }
  if(S.ai.provider === 'ollama'){
    container.innerHTML =
      '<label>Endpoint</label>' +
      '<input type="text" id="aiEndpoint" placeholder="http://localhost:11434/api/chat" value="' + U.esc(S.ai.endpoint || '') + '">' +
      '<label>Model</label>' +
      '<input type="text" id="aiModel" placeholder="llama3.2" value="' + U.esc(S.ai.model || '') + '">' +
      '<p class="hint">' + U.esc(p.desc) + '</p>';
    return;
  }
  container.innerHTML =
    '<label>API Anahtarı (' + U.esc(p.keyLabel) + ')</label>' +
    '<input type="password" id="aiKey" placeholder="' + U.esc(p.keyLabel) + '" value="' + U.esc(S.ai.key) + '">' +
    '<label>Model</label>' +
    '<input type="text" id="aiModel" placeholder="' + U.esc(p.model) + '" value="' + U.esc(S.ai.model) + '">' +
    '<p class="hint">' + U.esc(p.desc) + '</p>';
};

/* ═══════════════ KARTLAR ═══════════════ */
OZ.showCards = function(){
  const now = new Date();
  const due = S.cards.filter(function(c){ return new Date(c.due || 0) <= now; });
  if(!due.length){
    OZ.openModal('<h2>🃏 Kartlar <button onclick="OZ.closeModal()">×</button></h2>' +
      '<p class="hint">Bugün tekrar edilecek kart yok.</p>' +
      '<button class="btn primary" onclick="OZ.closeModal();OZ.addCard();">+ Yeni Kart</button>' +
      '<button class="btn" onclick="OZ.autoCards()">📚 KB\'den Oluştur</button>');
    return;
  }
  const c = due[0];
  OZ.openModal('<h2>🃏 Tekrar <button onclick="OZ.closeModal()">×</button></h2>' +
    '<p class="hint">' + due.length + ' kart bekliyor</p>' +
    '<div class="card" style="font-size:15px;padding:16px">' +
      '<p><b>' + U.esc(c.front) + '</b></p>' +
      '<p id="cardAnswer" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);color:var(--success)">' + U.esc(c.back) + '</p>' +
    '</div>' +
    '<button class="btn primary" id="showAns">Cevabı Göster</button>' +
    '<div class="seg" id="cardRate" style="margin-top:10px">' +
      '<button data-r="0">Zor</button><button data-r="1">İyi</button><button data-r="2">Kolay</button>' +
    '</div>');
  $('showAns').onclick = function(){
    $('cardAnswer').style.display = 'block';
    $('showAns').style.display = 'none';
  };
  $('cardRate').onclick = function(e){
    const b = e.target.closest('button');
    if(!b) return;
    const r = +b.dataset.r;
    if(r === 0) c.interval = 1;
    else if(r === 1) c.interval = (c.interval || 1) * 2;
    else c.interval = (c.interval || 1) * 4;
    c.due = new Date(Date.now() + c.interval * 86400000).toISOString();
    OZ.storage.set('cards', S.cards);
    OZ.showCards();
  };
};

OZ.addCard = function(){
  OZ.openModal('<h2>+ Yeni Kart <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Ön</label><input type="text" id="cardFront" placeholder="Soru">' +
    '<label>Arka</label><textarea id="cardBack" style="min-height:80px" placeholder="Cevap"></textarea>' +
    '<button class="btn primary" id="saveCard">Kaydet</button>');
  $('saveCard').onclick = function(){
    const f = $('cardFront').value.trim(), b = $('cardBack').value.trim();
    if(!f || !b) return U.toast('İkisi de gerekli');
    S.cards.push({ id: U.uid(), front: f, back: b, interval: 0, due: new Date().toISOString(), ts: Date.now() });
    OZ.storage.set('cards', S.cards);
    U.toast('Kart eklendi ✓');
    OZ.closeModal();
    OZ.render();
  };
};

OZ.autoCards = function(){
  let added = 0;
  OZ.KB.forEach(function(t){
    if(!S.cards.find(function(c){ return c.front === t.title; })){
      S.cards.push({
        id: U.uid(), front: t.title,
        back: t.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 280),
        interval: 0, due: new Date().toISOString(), ts: Date.now()
      });
      added++;
    }
  });
  OZ.storage.set('cards', S.cards);
  U.toast(added + ' kart eklendi · toplam ' + S.cards.length);
  OZ.closeModal();
  OZ.render();
};

/* ═══════════════ NOTLAR ═══════════════ */
OZ.showNotes = function(){
  let list;
  if(!S.notes.length){
    list = '<p class="hint">Henüz not yok.</p>';
  } else {
    list = S.notes.map(function(n){
      return '<div class="card"><h4>' + U.esc(n.title) + '</h4>' +
        '<p style="white-space:pre-wrap">' + U.esc(n.body.slice(0, 200)) + (n.body.length > 200 ? '…' : '') + '</p>' +
        '<div style="margin-top:6px">' +
          '<button class="chip" onclick="OZ.addNote(\'' + n.id + '\')">Düzenle</button> ' +
          '<button class="chip" onclick="OZ.delNote(\'' + n.id + '\')">Sil</button>' +
        '</div></div>';
    }).join('');
  }
  OZ.openModal('<h2>📝 Notlarım <button onclick="OZ.closeModal()">×</button></h2>' +
    '<button class="btn primary" onclick="OZ.addNote()">+ Yeni Not</button>' +
    '<div style="margin-top:14px">' + list + '</div>');
};

OZ.addNote = function(id){
  const n = id ? S.notes.find(function(x){ return x.id === id; }) : null;
  OZ.openModal('<h2>' + (n ? 'Düzenle' : 'Yeni Not') + ' <button onclick="OZ.closeModal()">×</button></h2>' +
    '<label>Başlık</label>' +
    '<input type="text" id="noteTitle" value="' + (n ? U.esc(n.title) : '') + '" placeholder="Not başlığı">' +
    '<label>İçerik</label>' +
    '<textarea id="noteBody" style="min-height:150px">' + (n ? U.esc(n.body) : '') + '</textarea>' +
    '<button class="btn primary" id="saveNote">Kaydet</button>');
  $('saveNote').onclick = function(){ OZ.saveNote(id); };
};

OZ.saveNote = function(id){
  const t = $('noteTitle').value.trim(), b = $('noteBody').value.trim();
  if(!t || !b) return U.toast('Başlık ve içerik gerekli');
  if(id){
    const n = S.notes.find(function(x){ return x.id === id; });
    if(n){ n.title = t; n.body = b; n.ts = Date.now(); }
  } else {
    S.notes.push({ id: U.uid(), title: t, body: b, ts: Date.now() });
  }
  OZ.storage.set('notes', S.notes);
  U.toast('Kaydedildi ✓');
  OZ.showNotes();
  OZ.render();
};

OZ.delNote = function(id){
  S.notes = S.notes.filter(function(n){ return n.id !== id; });
  OZ.storage.set('notes', S.notes);
  OZ.showNotes();
  OZ.render();
};

/* ═══════════════ EXPORT / IMPORT / RESET ═══════════════ */
OZ.exportAll = function(){
  const data = {
    v: 1, exportedAt: new Date().toISOString(),
    prefs: S.prefs, progress: S.progress, chat: S.chat,
    notes: S.notes, cards: S.cards, snippets: S.snippets, docs: S.docs
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'oznur-egitim-' + U.today() + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  U.toast('Yedek indirildi ✓');
};

OZ.importData = function(){
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json';
  inp.onchange = async function(){
    try {
      const text = await inp.files[0].text();
      const d = JSON.parse(text);
      if(!confirm('Mevcut verilerin üzerine yazılsın mı?')) return;
      Object.assign(S.prefs, d.prefs || {});
      Object.assign(S.progress, d.progress || {});
      if(d.chat) S.chat = d.chat;
      if(d.notes) S.notes = d.notes;
      if(d.cards) S.cards = d.cards;
      if(d.snippets) S.snippets = d.snippets;
      if(d.docs) S.docs = d.docs;
      OZ.saveAll();
      OZ.applyTheme();
      OZ.render();
      U.toast('Veriler geri yüklendi ✓');
    } catch(e) {
      U.toast('Geçersiz dosya: ' + e.message);
    }
  };
  inp.click();
};

OZ.resetAll = function(){
  if(!confirm('TÜM veriler silinecek. Emin misin?')) return;
  if(!confirm('Son kez: her şey silinsin mi?')) return;
  ['prefs','ai','progress','chat','notes','cards','snippets','docs','vfs'].forEach(function(k){
    OZ.storage.del(k);
  });
  location.reload();
};

/* ═══════════════ RENDER ═══════════════ */
OZ.render = function(){
  document.querySelectorAll('#bottomnav button').forEach(function(b){
    b.classList.toggle('active', b.dataset.tab === S.tab);
  });
  const view = $('view');
  const fn = OZ.views[S.tab];
  if(fn && view) fn(view);
  const label = $('modeLabel');
  if(label){
    if(OZ.aiActive()){
      const p = OZ.PROVIDERS[S.ai.provider];
      label.textContent = 'ÇEVRİMİÇİ · ' + (p ? p.short.toUpperCase() : 'AI');
    } else {
      label.textContent = 'ÇEVRİMDIŞI · YEREL MOD';
    }
  }
};

console.log('[Views] yüklendi');
})();
