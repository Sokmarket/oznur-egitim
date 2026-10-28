/* ÖZnur Eğitim — AI Köprüsü */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S;

OZ.aiSystemPrompt = function(){
  return 'Sen ÖZnur Eğitim uygulamasının öğretmen asistanısın. Kısa, anlaşılır, samimi Türkçe anlat. Kod örneklerini ```dil biçiminde blokla ver. Ezber değil sezgiyle öğret.';
};

OZ.askAI = async function(messages){
  if(!OZ.aiActive()) return null;
  const provider = OZ.PROVIDERS[S.ai.provider];
  if(!provider) return null;
  const model = S.ai.model || provider.model;

  try {
    if(S.ai.provider === 'gemini'){
      const url = provider.url.replace('{model}', model).replace('{key}', S.ai.key);
      const sys = messages.find(m => m.role === 'system');
      const others = messages.filter(m => m.role !== 'system');
      const body = {
        contents: others.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      };
      if(sys) body.systemInstruction = { parts: [{ text: sys.content }] };
      const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
    if(S.ai.provider === 'ollama'){
      const r = await fetch(S.ai.endpoint || provider.url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({model, messages, stream:false}) });
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      return d.message?.content || null;
    }
    const r = await fetch(S.ai.endpoint || provider.url, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+S.ai.key},
      body:JSON.stringify({model, messages, temperature:0.7, max_tokens:1024})
    });
    if(!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    return d.choices?.[0]?.message?.content || null;
  } catch(e) {
    console.warn('AI error:', e);
    return null;
  }
};

OZ.testConnection = async function(){
  if(!OZ.aiActive()){ U.toast('AI seçilmedi'); return; }
  U.toast('AI bağlantısı test ediliyor…');
  const r = await OZ.askAI([{ role:'user', content:'Tek kelimeyle cevap ver: çalışıyor' }]);
  if(r) U.toast('✅ AI bağlı: ' + r.slice(0, 30), 2200);
  else U.toast('❌ AI bağlanamadı — yerel mod', 2400);
  OZ.render();
};

OZ.formatAI = function(text){
  let s = U.esc(text);
  const blocks = [];
  s = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, l, c) => {
    const id = '§C' + blocks.length + '§';
    blocks.push('<pre><code>' + c.trim() + '</code></pre>');
    return id;
  });
  s = s.replace(/^###? (.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  s = s.replace(/^[ \t]*[-*][ \t]+(.+)$/gm, '<li>$1</li>');
  s = s.replace(/(<li>[\s\S]*?<\/li>)/g, m => m.includes('<ul>') ? m : '<ul>' + m + '</ul>');
  s = s.replace(/\n/g, '<br>');
  blocks.forEach((b, i) => { s = s.replace('§C' + i + '§', b); });
  return s;
};
})();
