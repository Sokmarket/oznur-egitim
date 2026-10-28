/* ÖZnur Eğitim — Günlük hatırlatıcı + Günün Konusu */
(function(){
'use strict';
const U = OZ.utils, S = OZ.S, $ = U.$;
console.log('[Reminder] yükleniyor...');

/* ═══ GÜNÜN KONUSU ═══ */
function todayTopicSeed(){
  const t = U.today().replace(/-/g, '');
  return parseInt(t, 10);
}

OZ.getTodayTopic = function(){
  if(!OZ.KB.length) return null;
  const seed = todayTopicSeed();
  const idx = seed % OZ.KB.length;
  return OZ.KB[idx];
};

/* Sohbet açıldığında günün konusunu göster (sadece günde 1 kez) */
function showDailyTopic(){
  if(S.prefs.noDailyTopic) return;
  const today = U.today();
  if(S.lastDailyTopic === today) return;
  S.lastDailyTopic = today;
  OZ.storage.set('lastDailyTopic', today);
  setTimeout(function(){
    const topic = OZ.getTodayTopic();
    if(!topic) return;
    OZ.addMsg(
      '<h3>📅 Günün Konusu</h3>' +
      '<p>Bugün için önerim:</p>' +
      '<p><b>📘 ' + U.esc(topic.title) + '</b></p>' +
      '<p style="font-size:12px;color:var(--muted);cursor:pointer;text-decoration:underline" onclick="OZ.askTopic(\'' + topic.id + '\')">Detay için tıkla</p>',
      'bot'
    );
  }, 2500);
}

OZ.askTopic = function(id){
  const topic = OZ.KB.find(function(t){ return t.id === id; });
  if(!topic) return;
  OZ.addMsg('<h3>📘 ' + U.esc(topic.title) + '</h3>' + topic.body, 'bot');
};

/* ═══ HATIRLATICI ═══ */
function checkReminder(){
  if(!S.prefs.reminderTime) return;
  if(!('Notification' in window)) return;
  if(Notification.permission !== 'granted') return;

  const now = new Date();
  const [h, m] = S.prefs.reminderTime.split(':').map(Number);
  const today = U.today();

  if(S.lastReminder === today) return;

  if(now.getHours() === h && now.getMinutes() >= m && now.getMinutes() < m + 2){
    S.lastReminder = today;
    OZ.storage.set('lastReminder', today);
    try {
      new Notification('📚 ÖZnur Eğitim', {
        body: 'Bugün için 5 dakika öğrenmeye ne dersin? 🔥 Seri: ' + (S.progress.streak || 0) + ' gün',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="22" fill="%230a0714"/%3E%3Ctext x="50" y="68" font-size="52" font-weight="700" text-anchor="middle" fill="%23f6d17b" font-family="Georgia"%3EÖz%3C/text%3E%3C/svg%3E',
        tag: 'oznur-daily',
        requireInteraction: false
      });
    } catch(e){ console.warn('Notification hatası:', e); }
  }
}

setInterval(checkReminder, 60000); /* her dakika */
setTimeout(checkReminder, 5000); /* başlangıçta kontrol */

/* ═══ AYARLAR'A HATIRLATICI EKLE ═══ */
const _showSettings = OZ.showSettings;
OZ.showSettings = function(){
  _showSettings.call(this);
  setTimeout(function(){
    const modal = $('modal-content');
    if(!modal || modal.querySelector('#reminderBox')) return;

    const box = document.createElement('div');
    box.id = 'reminderBox';
    box.style.cssText = 'margin-top:14px;padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:10px';

    const time = S.prefs.reminderTime || '';
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<span style="font-size:12px;color:var(--muted);font-weight:600">🔔 Günlük hatırlatıcı</span>' +
        '<input type="time" id="reminderTime" value="' + time + '" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;background:var(--panel);color:var(--ink);font-size:13px">' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<span style="font-size:12px;color:var(--muted);font-weight:600">📅 Günün konusu</span>' +
        '<button id="dailyToggle" style="padding:5px 12px;border-radius:14px;border:1px solid var(--border);background:' + (S.prefs.noDailyTopic ? 'var(--panel)' : 'var(--gold)') + ';color:' + (S.prefs.noDailyTopic ? 'var(--muted)' : '#1a1400') + ';font-weight:700;font-size:11px">' + (S.prefs.noDailyTopic ? 'KAPALI' : 'AÇIK') + '</button>' +
      '</div>' +
      '<div id="reminderStatus" style="font-size:11px;color:var(--muted);margin-top:4px"></div>' +
      '<button id="notifPermBtn" class="btn" style="margin-top:8px">🔔 Bildirim izni iste</button>';

    const fontLabel = $('fontLabel');
    if(fontLabel){
      const m = fontLabel.closest('.modal') || modal;
      m.appendChild(box);
    }

    /* Saat seçici */
    $('reminderTime').onchange = function(){
      S.prefs.reminderTime = this.value;
      OZ.storage.set('prefs', S.prefs);
      S.lastReminder = '';
      OZ.storage.set('lastReminder', '');
      updateReminderStatus();
      U.toast(this.value ? '⏰ ' + this.value + ' için hatırlatıcı kuruldu' : '⏰ Hatırlatıcı kapatıldı');
    };

    /* Günün konusu toggle */
    $('dailyToggle').onclick = function(){
      S.prefs.noDailyTopic = !S.prefs.noDailyTopic;
      this.textContent = S.prefs.noDailyTopic ? 'KAPALI' : 'AÇIK';
      this.style.background = S.prefs.noDailyTopic ? 'var(--panel)' : 'var(--gold)';
      this.style.color = S.prefs.noDailyTopic ? 'var(--muted)' : '#1a1400';
      OZ.storage.set('prefs', S.prefs);
    };

    /* Bildirim izni */
    $('notifPermBtn').onclick = async function(){
      if(!('Notification' in window)){
        U.toast('Bu tarayıcı bildirim desteklemiyor');
        return;
      }
      try {
        const perm = await Notification.requestPermission();
        updateReminderStatus();
        if(perm === 'granted'){
          U.toast('✅ Bildirim izni verildi');
          new Notification('ÖZnur Eğitim', { body: 'Bildirimler aktif! 🎉' });
        } else {
          U.toast('❌ Bildirim izni reddedildi');
        }
      } catch(e){ U.toast('Hata: ' + e.message); }
    };

    function updateReminderStatus(){
      const st = $('reminderStatus');
      if(!st) return;
      if(!('Notification' in window)){
        st.innerHTML = '<span style="color:var(--danger)">Bu tarayıcı bildirim desteklemiyor</span>';
        return;
      }
      if(Notification.permission === 'granted'){
        st.innerHTML = '<span style="color:var(--success)">✅ Bildirim izni verildi</span>' +
          (S.prefs.reminderTime ? ' · Saat: ' + S.prefs.reminderTime : '');
      } else if(Notification.permission === 'denied'){
        st.innerHTML = '<span style="color:var(--danger)">❌ Bildirim reddedildi — site ayarlarından aç</span>';
      } else {
        st.innerHTML = '<span style="color:var(--warning)">⚠️ Bildirim izni verilmedi</span>';
      }
    }
    updateReminderStatus();
  }, 80);
};

/* İlk açılışta günün konusu */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(showDailyTopic, 3000); });
} else {
  setTimeout(showDailyTopic, 3000);
}

console.log('[Reminder] hazır');
})();
