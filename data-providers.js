/* ÖZnur Eğitim — AI Sağlayıcı Tanımları */
(function(){
'use strict';
OZ.PROVIDERS = {
  none: { name:'Sadece Yerel', short:'Yerel', desc:'İnternet gerekmez.', model:'', url:'', keyLabel:'', icon:'📴', needsKey:false, needsEndpoint:false },
  openai: { name:'OpenAI', short:'OpenAI', desc:'GPT-4o mini — hızlı, ucuz.', model:'gpt-4o-mini', url:'https://api.openai.com/v1/chat/completions', keyLabel:'sk-...', icon:'🟢', needsKey:true, needsEndpoint:false, docsUrl:'https://platform.openai.com/api-keys', pricing:'Ücretli (~$0.0001/soru)' },
  gemini: { name:'Google Gemini', short:'Gemini', desc:'Gemini 1.5 Flash — ücretsiz tier.', model:'gemini-1.5-flash', url:'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}', keyLabel:'AIza...', icon:'🔵', needsKey:true, needsEndpoint:false, docsUrl:'https://aistudio.google.com/apikey', pricing:'Ücretsiz tier' },
  groq: { name:'Groq', short:'Groq', desc:'Llama 3.1 — çok hızlı, ücretsiz.', model:'llama-3.1-8b-instant', url:'https://api.groq.com/openai/v1/chat/completions', keyLabel:'gsk_...', icon:'⚡', needsKey:true, needsEndpoint:false, docsUrl:'https://console.groq.com/keys', pricing:'Ücretsiz tier' },
  openrouter: { name:'OpenRouter', short:'OpenRouter', desc:'Çoklu model, ücretsiz seçenekler.', model:'meta-llama/llama-3.1-8b-instruct:free', url:'https://openrouter.ai/api/v1/chat/completions', keyLabel:'sk-or-...', icon:'🌐', needsKey:true, needsEndpoint:false, docsUrl:'https://openrouter.ai/keys', pricing:'Ücretsiz modeller var' },
  ollama: { name:'Ollama (yerel)', short:'Ollama', desc:'Kendi sunucunda çalışan model.', model:'llama3.2', url:'http://localhost:11434/api/chat', keyLabel:'(gerekmez)', icon:'🏠', needsKey:false, needsEndpoint:true, docsUrl:'https://ollama.com', pricing:'Ücretsiz (yerel)' }
};
OZ.providerList = function(){ return Object.entries(OZ.PROVIDERS).map(([k,v]) => ({id:k, ...v})); };
OZ.currentProvider = function(){ return OZ.PROVIDERS[OZ.S.ai.provider] || OZ.PROVIDERS.none; };
})();
