/* ÖZnur Eğitim — Service Worker v2: dayanıklı cache */
const CACHE_VERSION = 'oznur-v2.0.0';
const CACHE_STATIC = CACHE_VERSION + '-static';
const CACHE_RUNTIME = CACHE_VERSION + '-runtime';

const PRECACHE = [
  './', './index.html', './styles.css', './core.js',
  './data-kb-1.js', './data-kb-2.js', './data-kb-3.js', './data-kb-4.js',
  './data-quiz.js', './data-providers.js',
  './ai.js', './views.js', './tools.js', './app.js',
  './manifest.json'
];

/* Kurulum: her dosyayı AYRI ayrı cache'le — biri düşse bile diğerleri kurtulur */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_STATIC).then(function(cache){
      return Promise.all(PRECACHE.map(function(url){
        return cache.add(url).catch(function(err){
          console.warn('Precache atlandı:', url, err);
        });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k.indexOf('oznur-') === 0 && k !== CACHE_STATIC && k !== CACHE_RUNTIME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Fetch: NETWORK-FIRST → sunucu varsa güncel, yoksa cache'ten */
self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  /* Cross-origin */
  if(url.origin !== self.location.origin){
    if(url.hostname.indexOf('openai') !== -1 ||
       url.hostname.indexOf('googleapis') !== -1 ||
       url.hostname.indexOf('groq') !== -1 ||
       url.hostname.indexOf('openrouter') !== -1 ||
       url.hostname.indexOf('ollama') !== -1 ||
       url.port === '11434') return;
    if(url.hostname.indexOf('cdn.jsdelivr.net') !== -1 && url.pathname.indexOf('pyodide') !== -1){
      e.respondWith(caches.match(req).then(function(c){
        return c || fetch(req).then(function(res){
          if(res.ok){
            const cl = res.clone();
            caches.open(CACHE_RUNTIME).then(function(cc){ cc.put(req, cl); });
          }
          return res;
        });
      }));
      return;
    }
    return;
  }

  /* Aynı origin → NETWORK-FIRST */
  e.respondWith(
    fetch(req).then(function(res){
      if(res.ok && res.type === 'basic'){
        const cl = res.clone();
        caches.open(CACHE_STATIC).then(function(c){ c.put(req, cl); });
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(cached){
        return cached || caches.match('./index.html');
      });
    })
  );
});
