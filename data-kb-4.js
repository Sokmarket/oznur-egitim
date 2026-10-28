/* ÖZnur Eğitim — KB 4: Araçlar, Veri, Web, AI, Güvenlik, Kariyer (32 konu) */
(function(){
'use strict';
OZ.KB = OZ.KB || [];

OZ.KB.push(
/* ═══ ARAÇLAR ═══ */
{id:'pip',cat:'Araçlar',keys:['pip','paket kur','pypi'],title:'pip — Paket Yöneticisi',body:`<pre><code>pip install requests
pip install requests==2.31.0    # sürüm
pip install -U requests         # güncelle
pip uninstall requests
pip list
pip show requests
pip freeze > requirements.txt
pip install -r requirements.txt</code></pre><p><b>PyPI:</b> Python Package Index — <code>pypi.org</code></p>`},
{id:'venv',cat:'Araçlar',keys:['venv','sanal ortam','virtual env'],title:'venv — Sanal Ortam',body:`<p>Her proje için izole Python ortamı.</p><pre><code>python -m venv .venv
source .venv/bin/activate       # Linux/Mac
.venv\\Scripts\\activate        # Windows
deactivate</code></pre><p><b>Neden:</b> Projeler arası paket çakışmasını önler.</p>`},
{id:'git',cat:'Araçlar',keys:['git','commit','branch','merge','version control'],title:'Git Temelleri',body:`<pre><code>git init
git status
git add .               # veya dosya
git commit -m "mesaj"
git log --oneline
git diff

git branch ozellik
git checkout ozellik    # veya git switch
git merge ozellik
git branch -d ozellik

git clone https://github.com/...
git remote add origin URL
git push origin main
git pull origin main

git restore dosya.txt
git reset --soft HEAD~1</code></pre>`},
{id:'github',cat:'Araçlar',keys:['github','pull request','pr','fork'],title:'GitHub',body:`<p>Git depolarının barındırıldığı platform.</p><ul><li><b>Repo:</b> Proje deposu</li><li><b>Fork:</b> Kopyalama</li><li><b>PR (Pull Request):</b> Değişiklik önerisi</li><li><b>Issue:</b> Hata/öneri</li><li><b>Actions:</b> CI/CD</li><li><b>Pages:</b> Statik site barındırma</li></ul>`},
{id:'pytest',cat:'Araçlar',keys:['test','pytest','unittest','assert'],title:'Test (pytest)',body:`<pre><code># hesap.py
def topla(a, b):
    return a + b

# test_hesap.py
from hesap import topla

def test_topla():
    assert topla(2, 3) == 5</code></pre><pre><code>pip install pytest
pytest                  # çalıştır
pytest -v               # ayrıntılı
pytest --cov=hesap     # kapsam
pytest -k topla         # isme göre</code></pre>`},
{id:'requests',cat:'Araçlar',keys:['requests','http','api','web request'],title:'requests — HTTP',body:`<pre><code>import requests

r = requests.get("https://api.github.com")
r.status_code       # 200
r.text              # ham
r.json()            # dict

requests.get(url, params={"q": "python"})
requests.post("https://ornek.com/api",
              json={"ad": "Ali"},
              headers={"Authorization": "Bearer token"})
requests.get(url, timeout=5)</code></pre>`},
{id:'argparse',cat:'Araçlar',keys:['argparse','komut satırı','cli','argv'],title:'argparse — CLI',body:`<pre><code>import argparse

p = argparse.ArgumentParser(description="Toplama")
p.add_argument("a", type=int)
p.add_argument("b", type=int)
p.add_argument("-v", "--verbose", action="store_true")

args = p.parse_args()
print(args.a + args.b)</code></pre><pre><code>python arac.py 2 3
python arac.py 2 3 -v
python arac.py --help</code></pre>`},
{id:'logging',cat:'Araçlar',keys:['logging','log','kayıt'],title:'logging',body:`<pre><code>import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

logging.debug("detay")      # 10
logging.info("bilgi")       # 20
logging.warning("uyarı")    # 30
logging.error("hata")       # 40
logging.critical("kritik")  # 50

logging.basicConfig(filename="app.log")</code></pre>`},
{id:'subprocess',cat:'Araçlar',keys:['subprocess','komut çalıştır','os.system'],title:'subprocess',body:`<pre><code>import subprocess

r = subprocess.run(
    ["ls", "-la"],
    capture_output=True, text=True
)
print(r.stdout)
print(r.returncode)     # 0 = başarı

subprocess.run("echo merhaba", shell=True)</code></pre><p><b>UYARI:</b> Kullanıcı girdisini <code>shell=True</code> ile birleştirme.</p>`},
{id:'datetime',cat:'Araçlar',keys:['datetime','tarih','zaman','strftime'],title:'datetime',body:`<pre><code>from datetime import datetime, date, timedelta

simdi = datetime.now()
bugun = date.today()

simdi.strftime("%Y-%m-%d %H:%M:%S")
datetime.strptime("2024-01-15", "%Y-%m-%d")

yarin = bugun + timedelta(days=1)
gecen_hafta = bugun - timedelta(weeks=1)

fark = yarin - bugun
fark.days       # 1</code></pre>`},

/* ═══ VERİ ═══ */
{id:'sql',cat:'Veri',keys:['sql','veritabanı','select','insert','join'],title:'SQL Temelleri',body:`<pre><code>CREATE TABLE kisi (
    id INTEGER PRIMARY KEY,
    ad TEXT NOT NULL,
    yas INTEGER
);

INSERT INTO kisi (ad, yas) VALUES ('Ali', 25);

SELECT * FROM kisi;
SELECT ad FROM kisi WHERE yas > 20;
SELECT * FROM kisi ORDER BY yas DESC LIMIT 10;

UPDATE kisi SET yas = 26 WHERE ad = 'Ali';
DELETE FROM kisi WHERE id = 1;

SELECT k.ad, s.tutar
FROM kisi k
JOIN siparis s ON k.id = s.kisi_id;

SELECT sehir, COUNT(*) FROM kisi GROUP BY sehir;</code></pre>`},
{id:'sqlite-python',cat:'Veri',keys:['sqlite','sqlite3','python sql'],title:'SQLite ile Python',body:`<pre><code>import sqlite3

con = sqlite3.connect("veri.db")
cur = con.cursor()

cur.execute("""CREATE TABLE IF NOT EXISTS kisi(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad TEXT NOT NULL,
    yas INTEGER)""")

# Parametreli (GÜVENLİ)
cur.execute("INSERT INTO kisi(ad, yas) VALUES (?, ?)", ("Ali", 25))
con.commit()

cur.executemany("INSERT INTO kisi(ad, yas) VALUES (?, ?)",
                [("Ayşe", 30), ("Mehmet", 28)])
con.commit()

for satir in cur.execute("SELECT * FROM kisi"):
    print(satir)

con.row_factory = sqlite3.Row
cur = con.cursor()
for satir in cur.execute("SELECT * FROM kisi"):
    print(satir["ad"])

con.close()</code></pre>`},
{id:'numpy',cat:'Veri',keys:['numpy','array','np','bilimsel'],title:'NumPy Temelleri',body:`<pre><code>import numpy as np

a = np.array([1, 2, 3, 4])
a * 2               # [2, 4, 6, 8]
a.sum()
a.mean()

np.zeros(5)
np.ones((2,3))
np.arange(0, 10, 2)
np.linspace(0, 1, 5)
np.random.rand(3)

m = np.array([[1,2],[3,4]])
m.T                     # transpoze
m @ m                   # matris çarpımı
np.linalg.inv(m)

m[0, 1]
m[:, 0]
m[m > 2]                # filtre</code></pre>`},
{id:'pandas',cat:'Veri',keys:['pandas','dataframe','pd','veri analizi'],title:'pandas Temelleri',body:`<pre><code>import pandas as pd

df = pd.read_csv("veri.csv")
df = pd.read_excel("a.xlsx")

df.head()
df.tail()
df.info()
df.describe()
df.shape

df["ad"]
df[["ad","yas"]]
df.loc[0]
df.iloc[0]
df[df["yas"] > 25]      # filtre

df["yeni"] = df["yas"] * 2
df.drop("sutun", axis=1)

df.groupby("sehir")["yas"].mean()
df.sort_values("yas", ascending=False)

df.to_csv("cikti.csv", index=False)</code></pre>`},
{id:'matplotlib',cat:'Veri',keys:['matplotlib','grafik','plot','chart'],title:'Matplotlib',body:`<pre><code>import matplotlib.pyplot as plt

plt.plot([1,2,3,4], [1,4,9,16])
plt.xlabel("x")
plt.ylabel("x²")
plt.title("Kare fonksiyonu")
plt.grid(True)
plt.show()

plt.bar(["A","B","C"], [10, 20, 15])
plt.scatter(x, y, c="red")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.plot(x, y)
ax2.bar(x, y)
plt.tight_layout()</code></pre>`},
{id:'veri-temizleme',cat:'Veri',keys:['veri temizleme','data cleaning','nan','missing'],title:'Veri Temizleme',body:`<pre><code>import pandas as pd

df = pd.read_csv("veri.csv")

df.isna().sum()
df.dropna()
df.dropna(subset=["yas"])
df["yas"].fillna(0)
df["yas"].fillna(df["yas"].mean())

df.drop_duplicates()

df["yas"] = df["yas"].astype(int)
df["ad"] = df["ad"].str.strip().str.lower()

df = df[df["yas"].between(0, 120)]</code></pre>`},

/* ═══ WEB ═══ */
{id:'http',cat:'Web',keys:['http','protokol','status code','get','post'],title:'HTTP Protokolü',body:`<p><b>Metotlar:</b></p><ul><li><b>GET:</b> Veri al</li><li><b>POST:</b> Veri gönder</li><li><b>PUT:</b> Değiştir</li><li><b>DELETE:</b> Sil</li></ul><p><b>Durum kodları:</b></p><ul><li><b>200</b> OK</li><li><b>201</b> Created</li><li><b>301</b> Moved</li><li><b>400</b> Bad Request</li><li><b>401</b> Unauthorized</li><li><b>403</b> Forbidden</li><li><b>404</b> Not Found</li><li><b>500</b> Server Error</li></ul>`},
{id:'rest',cat:'Web',keys:['rest','api','restful','endpoint'],title:'REST API',body:`<p>HTTP üzerinde kaynak tabanlı mimari.</p><pre><code>GET    /kisiler        # hepsini
GET    /kisiler/1      # 1'i
POST   /kisiler        # yeni
PUT    /kisiler/1      # güncelle
DELETE /kisiler/1      # sil</code></pre><p><b>İlkeler:</b> Durumsuz (stateless), kaynak tabanlı URL, HTTP metotları, JSON format.</p>`},
{id:'flask',cat:'Web',keys:['flask','web framework','python web'],title:'Flask — Mini Web',body:`<pre><code>from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def ana():
    return "Merhaba ÖZnur!"

@app.route("/api/kisiler", methods=["GET"])
def listele():
    return jsonify([{"ad": "Ali"}, {"ad": "Ayşe"}])

@app.route("/api/kisiler", methods=["POST"])
def ekle():
    veri = request.json
    return jsonify(veri), 201

if __name__ == "__main__":
    app.run(debug=True)</code></pre><pre><code>pip install flask
python app.py
# http://localhost:5000</code></pre>`},
{id:'html-css-js',cat:'Web',keys:['html','css','javascript','frontend','web'],title:'HTML / CSS / JS Mini',body:`<pre><code>&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;style&gt;
    body { font-family: sans-serif; background: #f5f0e3; }
    .kart { padding: 16px; border-radius: 12px; background: #fff; }
    .buton { padding: 8px 16px; background: #a78bfa; color: #fff; border: 0; border-radius: 8px; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div class="kart"&gt;
    &lt;h1 id="baslik"&gt;Merhaba&lt;/h1&gt;
    &lt;button class="buton" onclick="selamla()"&gt;Tıkla&lt;/button&gt;
  &lt;/div&gt;
  &lt;script&gt;
    function selamla() {
      document.getElementById("baslik").textContent = "ÖZnur Eğitim!";
    }
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`},

/* ═══ AI ═══ */
{id:'ml-giris',cat:'AI',keys:['makine öğrenmesi','ml','yapay zeka','ai'],title:'Makine Öğrenmesi Giriş',body:`<p>Veriden örüntü öğrenme.</p><p><b>Türler:</b></p><ul><li><b>Denetimli:</b> Etiketli veri — sınıflama, regresyon</li><li><b>Denetimsiz:</b> Etiketsiz — kümeleme</li><li><b>Pekiştirmeli:</b> Ödül/ceza ile</li></ul><p><b>Adımlar:</b> Veri → Temizlik → Özellik → Model → Eğitim → Değerlendirme</p>`},
{id:'sklearn',cat:'AI',keys:['sklearn','scikit-learn','model','train','predict'],title:'scikit-learn',body:`<pre><code>from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

tahmin = model.predict(X_test)
accuracy_score(y_test, tahmin)</code></pre>`},
{id:'supervised',cat:'AI',keys:['supervised','denetimli','classification','regression'],title:'Denetimli Öğrenme',body:`<p><b>Sınıflama:</b> Kategorik çıktı (kedi/köpek).</p><ul><li>Logistic Regression</li><li>Decision Tree</li><li>Random Forest</li><li>SVM</li><li>Neural Network</li></ul><p><b>Regresyon:</b> Sürekli çıktı (fiyat).</p><ul><li>Linear Regression</li><li>Ridge/Lasso</li><li>Gradient Boosting</li></ul>`},
{id:'neural-net',cat:'AI',keys:['neural network','sinir ağı','deep learning','derin öğrenme'],title:'Sinir Ağları',body:`<p>Beyinden esinlenmiş katmanlı model.</p><ul><li><b>Input layer:</b> Girdi</li><li><b>Hidden layers:</b> Ara katmanlar</li><li><b>Output layer:</b> Çıktı</li><li><b>Weight:</b> Ağırlıklar (öğrenilen)</li><li><b>Activation:</b> ReLU, sigmoid, softmax</li></ul><p><b>Eğitim döngüsü:</b> Forward → Loss → Backprop → Update</p>`},
{id:'pytorch',cat:'AI',keys:['pytorch','torch','tensorflow','keras'],title:'PyTorch / TensorFlow',body:`<pre><code>import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),
    nn.Linear(32, 1)
)

kayip_f = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(100):
    cikti = model(X)
    kayip = kayip_f(cikti, y)
    optimizer.zero_grad()
    kayip.backward()
    optimizer.step()</code></pre>`},

/* ═══ GÜVENLİK ═══ */
{id:'hash',cat:'Güvenlik',keys:['hash','sha','md5','parola','password'],title:'Hash Fonksiyonu',body:`<p>Tek yönlü şifreleme — geri döndürülemez.</p><pre><code>import hashlib

hashlib.md5(b"veri").hexdigest()
hashlib.sha256(b"veri").hexdigest()

import bcrypt
sifreli = bcrypt.hashpw(b"parola", bcrypt.gensalt())
bcrypt.checkpw(b"parola", sifreli)    # True</code></pre><p><b>MD5/SHA1:</b> Artık güvensiz. <b>SHA256:</b> Bütünlük kontrolü.</p><p><b>Parola için:</b> bcrypt, argon2, scrypt.</p>`},
{id:'sifreleme',cat:'Güvenlik',keys:['şifreleme','encryption','aes','crypto'],title:'Şifreleme',body:`<p><b>Simetrik:</b> Aynı anahtar (AES). Hızlı.</p><p><b>Asimetrik:</b> Açık + özel anahtar (RSA, ECC). Yavaş.</p><pre><code>from cryptography.fernet import Fernet

key = Fernet.generate_key()
f = Fernet(key)

sifreli = f.encrypt(b"gizli mesaj")
f.decrypt(sifreli)</code></pre><p><b>Kural:</b> Kendi kriptonu yazma, kütüphane kullan.</p>`},
{id:'injection',cat:'Güvenlik',keys:['injection','sql injection','xss','enjeksiyon'],title:'Injection Saldırıları',body:`<p><b>SQL Injection:</b></p><pre><code># YANLIŞ
cur.execute(f"SELECT * FROM u WHERE ad='{kullanici}'")

# DOĞRU (parametreli)
cur.execute("SELECT * FROM u WHERE ad=?", (kullanici,))</code></pre><p><b>XSS (Cross-Site Scripting):</b></p><pre><code># Kötü
element.innerHTML = kullanici_girdisi
# İyi
element.textContent = kullanici_girdisi</code></pre>`},
{id:'guvenlik-checklist',cat:'Güvenlik',keys:['güvenlik checklist','best practices','owasp'],title:'Güvenlik Kontrol Listesi',body:`<ul><li>✅ Parolayı <b>bcrypt</b> ile sakla</li><li>✅ SQL'de <b>parametreli sorgu</b></li><li>✅ HTML çıktısında <b>escape</b></li><li>✅ <code>eval()</code> ile kullanıcı girdisi çalıştırma</li><li>✅ <code>shell=True</code> ile kullanıcı girdisi birleştirme</li><li>✅ API anahtarlarını koda gömme (<code>.env</code>)</li><li>✅ HTTPS kullan</li><li>✅ Bağımlılıkları güncelle (<code>pip-audit</code>)</li><li>✅ Yedek al</li></ul>`},

/* ═══ KARİYER ═══ */
{id:'cv',cat:'Kariyer',keys:['cv','özgeçmiş','resume','iş başvuru'],title:'CV İpuçları',body:`<ul><li>1-2 sayfa, net, okunabilir</li><li><b>Projeler öne:</b> GitHub linkleri</li><li>Somut başarılar: "süreyi %30 azalttım"</li><li>Sıralama: Deneyim → Projeler → Eğitim → Beceriler</li><li>Anahtar kelimeler (ilanla uyumlu)</li><li>Yazım hatası olmasın</li><li>Fotoğraf opsiyonel</li><li>PDF gönder</li></ul>`},
{id:'mulakat',cat:'Kariyer',keys:['mülakat','interview','soru','algoritma soru'],title:'Mülakat Soruları',body:`<p><b>Python temel:</b></p><ul><li>list vs tuple farkı?</li><li>shallow vs deep copy?</li><li>GIL nedir?</li><li>*args, **kwargs?</li><li>Decorator nedir?</li></ul><p><b>Algoritma:</b></p><ul><li>İkili arama yaz</li><li>Fibonacci (memoization)</li><li>String ters çevirme</li><li>Palindrom kontrolü</li><li>İki listeden ortak elemanlar</li></ul><p><b>İpucu:</b> Sesli düşün, örneklerle konuş, kenar durumları sor.</p>`},
{id:'portfolyo',cat:'Kariyer',keys:['portfolyo','portfolio','proje','github profil'],title:'Portfolyo',body:`<ul><li><b>GitHub:</b> 3-5 iyi proje, README'li</li><li><b>Her projede:</b> Ne, neden, nasıl, ekran görüntüsü</li><li><b>Küçük ama bitmiş</b> > büyük ama yarım</li><li><b>Fikirler:</b><ul><li>Hava durumu CLI</li><li>Not uygulaması</li><li>Web scraper</li><li>Quiz bot</li></ul></li><li><b>Kişisel site:</b> GitHub Pages ücretsiz</li></ul>`},
{id:'ogrenme-yolu',cat:'Kariyer',keys:['öğrenme yolu','roadmap','nasıl öğrenirim'],title:'Python Öğrenme Yolu',body:`<p><b>1. Temel (2-4 hafta):</b></p><ul><li>Değişken, tip, operatör</li><li>Koşul, döngü, fonksiyon</li><li>Liste, sözlük, set, tuple</li></ul><p><b>2. Orta (4-6 hafta):</b></p><ul><li>Dosya, JSON, CSV</li><li>Hata yönetimi</li><li>Modüller, OOP</li></ul><p><b>3. İleri:</b></p><ul><li>Decorator, generator</li><li>Type hints, test</li><li>Async/await</li></ul><p><b>4. Uzmanlık (seç):</b></p><ul><li>Web (Flask/FastAPI/Django)</li><li>Veri (pandas, numpy)</li><li>AI/ML (scikit-learn, PyTorch)</li><li>Otomasyon (selenium, requests)</li></ul><p><b>Kural:</b> Her konuda küçük proje yap.</p>`}
);

console.log('[KB-4] yüklendi: ' + OZ.KB.length + ' toplam konu');
})();
