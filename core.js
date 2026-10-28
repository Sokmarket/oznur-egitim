/* ÖZnur Eğitim — Çekirdek: util, storage, state, arama, ilerleme, modal */
(function(){
'use strict';

/* ═══ GLOBAL NAMESPACE ═══ */
const OZ = window.OZ = {
  KB: [],
  QUIZ: [],
  PROVIDERS: {},
  S: {},
  utils: {},
  views: {},
  tools: {}
};

/* ═══════════ UTIL ═══════════ */
const U = OZ.utils;

U.$ = function(id){ return document.getElementById(id); };
U.$$ = function(sel){ return document.querySelectorAll(sel); };

U.esc = function(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
};

U.uid = function(){
  return Math.random().toString(36).slice(2, 10);
};

U.today = function(){
  return new Date().toISOString().slice(0, 10);
};

U.daysBetween = function(a, b){
  return Math.round((new Date(b) - new Date(a)) / 86400000);
};

U.norm = function(s){
  return String(s).toLowerCase()
    .replace(/[ıİ]/g, 'i')
    .replace(/[şŞ]/g, 's')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

U.lev = function(a, b){
  if(a === b) return 0;
  if(!a.length) return b.length;
  if(!b.length) return a.length;
  if(a.length < b.length){ const t = a; a = b; b = t; }
  let prev = [];
  for(let i = 0; i <= b.length; i++) prev[i] = i;
  for(let i = 0; i < a.length; i++){
    const cur = [i + 1];
    for(let j = 0; j < b.length; j++){
      cur[j + 1] = Math.min(
        prev[j + 1] + 1,
        cur[j] + 1,
        prev[j] + (a[i] === b[j] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[b.length];
};

U.toast = function(msg, ms){
  ms = ms || 1800;
  const t = U.$('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(function(){ t.classList.remove('show'); }, ms);
};

/* ═══════════ STORAGE ═══════════ */
const store = OZ.storage = {
  get: function(k, d){
    try {
      const v = localStorage.getItem('oznur_' + k);
      return v ? JSON.parse(v) : d;
    } catch(e) { return d; }
  },
  set: function(k, v){
    try { localStorage.setItem('oznur_' + k, JSON.stringify(v)); }
    catch(e) { console.warn('storage.set:', e); }
  },
  del: function(k){
    try { localStorage.removeItem('oznur_' + k); }
    catch(e) {}
  }
};

/* ═══════════ STATE ═══════════ */
const S = OZ.S;

S.prefs = Object.assign(
  { theme: 'dark', font: 100, speed: 1, lang: 'tr', tts: false },
  store.get('prefs', {})
);

S.ai = Object.assign(
  { provider: 'none', key: '', model: '', endpoint: '' },
  store.get('ai', {})
);

S.progress = Object.assign(
  { xp: 0, streak: 0, lastDay: '', badges: [], quizTotal: 0, quizCorrect: 0, askCount: 0 },
  store.get('progress', {})
);

S.chat = store.get('chat', []);
S.notes = store.get('notes', []);
S.cards = store.get('cards', []);
S.snippets = store.get('snippets', []);
S.docs = store.get('docs', []);

S.vfs = store.get('vfs', {
  cwd: '/home',
  files: {
    '/home/not.txt': 'Merhaba ÖZnur!',
    '/etc/motd': 'ÖZnur Eğitim Terminali'
  }
});

S.quiz = { active: false, index: 0, score: 0, order: [] };
S.tab = 'chat';
S.pyodide = null;

/* ═══════════ KAYDET ═══════════ */
OZ.saveAll = function(){
  store.set('prefs', S.prefs);
  store.set('ai', S.ai);
  store.set('progress', S.progress);
  store.set('chat', S.chat);
  store.set('notes', S.notes);
  store.set('cards', S.cards);
  store.set('snippets', S.snippets);
  store.set('docs', S.docs);
  store.set('vfs', S.vfs);
};

/* ═══════════ ARAMA ═══════════ */
OZ.findTopic = function(q){
  const n = U.norm(q);
  if(!n) return null;

  const words = n.split(' ').filter(function(w){ return w.length > 2; });
  let best = null;
  let bestScore = 0;

  for(let t = 0; t < OZ.KB.length; t++){
    const topic = OZ.KB[t];
    let score = 0;

    for(let k = 0; k < topic.keys.length; k++){
      const nk = U.norm(topic.keys[k]);

      if(n === nk){ score = 1; break; }
      if(n.indexOf(nk) !== -1 || nk.indexOf(n) !== -1){
        score = Math.max(score, 0.9);
      } else if(n.length > 4 && nk.length > 4){
        const sim = 1 - U.lev(n, nk) / Math.max(n.length, nk.length);
        if(sim > 0.72) score = Math.max(score, sim * 0.9);
      }

      const nkWords = nk.split(' ');
      for(let wi = 0; wi < words.length; wi++){
        for(let ki = 0; ki < nkWords.length; ki++){
          const kw = nkWords[ki];
          if(kw.length > 3){
            if(words[wi] === kw) score = Math.max(score, 0.85);
            else if(U.lev(words[wi], kw) < 2) score = Math.max(score, 0.7);
          }
        }
      }
    }

    if(score > bestScore){
      bestScore = score;
      best = topic;
    }
  }

  return bestScore >= 0.6 ? best : null;
};

/* ═══════════ İLERLEME ═══════════ */
OZ.saveProgress = function(){
  store.set('progress', S.progress);
};

OZ.unlockBadge = function(id){
  if(S.progress.badges.indexOf(id) === -1){
    S.progress.badges.push(id);
    OZ.saveProgress();
  }
};

OZ.checkStreak = function(){
  const t = U.today();
  if(S.progress.lastDay === t) return;

  const diff = S.progress.lastDay
    ? U.daysBetween(S.progress.lastDay, t)
    : 999;

  if(diff === 1) S.progress.streak++;
  else if(diff > 1) S.progress.streak = 1;
  else if(S.progress.streak === 0) S.progress.streak = 1;

  S.progress.lastDay = t;

  if(S.progress.streak >= 3) OZ.unlockBadge('streak3');
  if(S.progress.streak >= 7) OZ.unlockBadge('streak7');
  if(S.progress.xp >= 100) OZ.unlockBadge('xp100');
  if(S.progress.xp >= 500) OZ.unlockBadge('xp500');
  if(S.progress.askCount >= 1) OZ.unlockBadge('first_ask');
  if(S.progress.askCount >= 10) OZ.unlockBadge('curious');
  if(S.progress.quizTotal >= 1) OZ.unlockBadge('quiz_first');
};

/* ═══════════ TEMA ═══════════ */
OZ.applyTheme = function(){
  document.documentElement.dataset.theme = S.prefs.theme;
  document.body.style.fontSize = S.prefs.font + '%';
};

/* ═══════════ MODAL ═══════════ */
OZ.openModal = function(html){
  const m = U.$('modal-content');
  if(!m) return;
  m.innerHTML = html;
  U.$('modal-overlay').classList.remove('hidden');
  m.scrollTop = 0;
};

OZ.closeModal = function(){
  const ov = U.$('modal-overlay');
  if(ov) ov.classList.add('hidden');
};

/* ═══════════ AI DURUMU ═══════════ */
OZ.aiActive = function(){
  if(S.ai.provider === 'none') return false;
  if(S.ai.provider === 'ollama') return true;
  return !!S.ai.key;
};

console.log('[Core] yüklendi · prefs.theme=' + S.prefs.theme);
})();
