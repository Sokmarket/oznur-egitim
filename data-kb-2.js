/* ÖZnur Eğitim — KB 2: Python Temel + Veri (36 konu) */
(function(){
'use strict';
OZ.KB = OZ.KB || [];

OZ.KB.push(
/* ═══ PYTHON TEMEL ═══ */
{id:'python-nedir',cat:'Python Temel',keys:['python','python nedir','python kurulum'],title:'Python Nedir?',body:`<p>Yorumlanan, yüksek seviyeli, çok amaçlı programlama dili. Guido van Rossum, 1991.</p><ul><li>Kolay okunur sözdizimi</li><li>Zengin standart kütüphane</li><li>Veri bilimi, web, otomasyon, yapay zekâ</li><li>Yorumlanır (compile gerekmez)</li></ul><pre><code>pkg install python      # Termux
python --version        # kontrol
python dosya.py         # çalıştır
python                  # REPL</code></pre>`},
{id:'repl',cat:'Python Temel',keys:['repl','etkileşimli','python shell'],title:'Python REPL',body:`<p>Read-Eval-Print Loop: anlık kod denemek için.</p><pre><code>$ python
>>> 2 + 3
5
>>> print("Merhaba")
Merhaba
>>> exit()</code></pre><p><b>İpucu:</b> Küçük testler için harika, kalıcı kod için dosya kullan.</p>`},
{id:'pep8',cat:'Python Temel',keys:['pep8','pep 8','stil','kod stili'],title:'PEP 8 — Stil Rehberi',body:`<ul><li>Girinti: <b>4 boşluk</b></li><li>Satır: en fazla 79 karakter</li><li>Değişken: <code>kucuk_harf_alt_cizgi</code></li><li>Sınıf: <code>BuyukHarf</code></li><li>Sabit: <code>BUYUK_HARF</code></li><li>İşleçler: <code>a = b + c</code></li><li>Fonksiyon arası: 2 boş satır</li><li>Import sırası: standart → 3. parti → yerel</li></ul><pre><code>pip install flake8 black
black dosya.py        # otomatik formatla</code></pre>`},
{id:'degisken',cat:'Python Temel',keys:['değişken','variable','var','atama'],title:'Değişkenler',body:`<pre><code>x = 10
isim = "Ali"
pi = 3.14
a, b = 1, 2
a, b = b, a   # takas (tek satır!)

x = y = z = 0</code></pre><p><b>Kurallar:</b></p><ul><li>Harf, rakam, <code>_</code></li><li>Sayı ile başlayamaz</li><li>Büyük/küçük harf duyarlı</li><li>Anahtar kelime olamaz (<code>if</code>, <code>for</code>, <code>class</code>...)</li></ul>`},
{id:'int-float',cat:'Python Temel',keys:['int','integer','float','sayı','tam sayı'],title:'int ve float',body:`<p><b>int (tam sayı):</b> Sınırsız büyüklük (RAM ile sınırlı).</p><pre><code>x = 10
y = -42
z = 1_000_000    # okunabilirlik
w = 0b1010       # binary
h = 0xFF         # hex</code></pre><p><b>float (ondalık):</b> Kayan nokta.</p><pre><code>p = 3.14
q = 1.5e3        # 1500.0
r = 0.1 + 0.2    # 0.30000000000000004

import math
math.isclose(0.1+0.2, 0.3)   # True</code></pre>`},
{id:'str',cat:'Python Temel',keys:['str','string','metin','karakter'],title:'str (Metin)',body:`<pre><code>isim = "Ali"
mesaj = f"Merhaba {isim}!"
tekrar = "ab" * 3       # "ababab"
birlesik = "a" + "b"    # "ab"

isim[0]      # "A"
isim[-1]     # "i"
isim[0:3]    # "Ali"</code></pre><p><b>Sık metotlar:</b></p><ul><li><code>upper(), lower(), capitalize()</code></li><li><code>strip(), lstrip(), rstrip()</code></li><li><code>split(), join(), replace()</code></li><li><code>startswith(), endswith(), find(), count()</code></li></ul>`},
{id:'bool',cat:'Python Temel',keys:['bool','true','false','doğru','yanlış'],title:'bool (Mantıksal)',body:`<pre><code>a = True
b = 5 > 3       # True

bool(0)         # False
bool("")        # False
bool([])        # False
bool({})        # False
bool(None)      # False
bool(1)         # True
bool("0")       # True (dolu string!)</code></pre><p><b>Falsy:</b> 0, "", [], {}, (), None, False</p>`},
{id:'none',cat:'Python Temel',keys:['none','boş','null'],title:'None',body:`<pre><code>x = None
if x is None:
    print("Değer yok")</code></pre><p><b>None vs 0 vs ""</b> — farklı şeyler.</p><p><b>Doğru karşılaştırma:</b> <code>is None</code> (== değil)</p>`},
{id:'operator',cat:'Python Temel',keys:['operatör','aritmetik','işlem','toplama','bölme'],title:'Operatörler',body:`<p><b>Aritmetik:</b></p><pre><code>10 + 3   # 13
10 - 3   # 7
10 * 3   # 30
10 / 3   # 3.333...
10 // 3  # 3 (tam bölme)
10 % 3   # 1 (kalan)
2 ** 10  # 1024 (kuvvet)</code></pre><p><b>Karşılaştırma:</b> <code>== != < > <= >=</code></p><p><b>Mantıksal:</b> <code>and or not</code></p><p><b>Üyelik:</b> <code>in, not in</code></p><p><b>Kimlik:</b> <code>is, is not</code></p>`},
{id:'fstring',cat:'Python Temel',keys:['f-string','fstring','format','biçimlendirme'],title:'f-String',body:`<pre><code>isim = "Ali"
yas = 25
print(f"{isim} {yas} yaşında")

print(f"{3.14159:.2f}")     # 3.14
print(f"{1000000:,}")       # 1,000,000
print(f"{0.25:.0%}")        # 25%
print(f"{'sol':<10}|")      # sola yasla
print(f"{'sağ':>10}|")      # sağa yasla
print(f"{'orta':^10}|")     # ortala</code></pre><p><b>Python 3.6+</b> — modern ve hızlı.</p>`},
{id:'if-else',cat:'Python Temel',keys:['if','else','elif','koşul','karar'],title:'if / elif / else',body:`<pre><code>not_ = 85
if not_ >= 90:
    print("AA")
elif not_ >= 80:
    print("BA")
elif not_ >= 70:
    print("BB")
else:
    print("Kaldı")</code></pre><p><b>Kurallar:</b></p><ul><li>Girinti zorunlu (4 boşluk)</li><li>Koşul sonunda <code>:</code></li><li>Python'da <code>switch</code> yok (3.10+ match var)</li></ul>`},
{id:'ternary',cat:'Python Temel',keys:['ternary','koşullu ifade','tek satır if'],title:'Ternary',body:`<pre><code>x = 10
durum = "büyük" if x > 5 else "küçük"

# İç içe (az kullan)
kategori = "A" if x>90 else "B" if x>80 else "C"</code></pre>`},
{id:'match',cat:'Python Temel',keys:['match','case','switch'],title:'match / case (3.10+)',body:`<pre><code>komut = "başlat"
match komut:
    case "başlat":
        print("Başlatılıyor")
    case "durdur" | "dur":
        print("Duruyor")
    case _:
        print("Bilinmiyor")</code></pre><p><code>_</code> = varsayılan.</p>`},
{id:'for',cat:'Python Temel',keys:['for','for döngüsü','range','enumerate','zip'],title:'for Döngüsü',body:`<pre><code>for i in range(5):          # 0,1,2,3,4
    print(i)

for i in range(1, 10, 2):   # 1,3,5,7,9
    print(i)

for i, harf in enumerate(["a","b","c"]):
    print(i, harf)

for x, y in zip([1,2],["a","b"]):
    print(x, y)

for k, v in {"a":1,"b":2}.items():
    print(k, v)</code></pre>`},
{id:'while',cat:'Python Temel',keys:['while','sonsuz döngü','loop'],title:'while Döngüsü',body:`<pre><code>i = 0
while i < 5:
    print(i)
    i += 1

while True:
    cevap = input("Çıkış q: ")
    if cevap == "q":
        break</code></pre><p><b>Dikkat:</b> Sayaç güncellemesi unutulursa sonsuz döngü.</p>`},
{id:'break-continue',cat:'Python Temel',keys:['break','continue','pass','döngü kontrol'],title:'break / continue / pass',body:`<pre><code>for i in range(10):
    if i == 5:
        break           # döngüden çık
    if i % 2 == 0:
        continue        # bu turu atla
    print(i)

def bos():
    pass                # "hiçbir şey yapma"</code></pre>`},
{id:'input',cat:'Python Temel',keys:['input','girdi','kullanıcı girdisi'],title:'input()',body:`<pre><code>isim = input("Adın ne? ")
yas = int(input("Yaşın? "))

print(f"Merhaba {isim}, {yas} yaşındasın")</code></pre><p><b>Dikkat:</b> input her zaman <code>str</code> döndürür. Sayı için <code>int()</code> veya <code>float()</code>.</p>`},
{id:'print',cat:'Python Temel',keys:['print','yazdır','çıktı','sep','end'],title:'print()',body:`<pre><code>print("Merhaba")
print("a", "b", "c")              # a b c
print("a", "b", sep="-")          # a-b
print("a", end="")                # satır atlama
print("b")                        # ab

print("x", 10, True)

print("log", file=open("a.txt","w"))</code></pre>`},
{id:'tip-donusum',cat:'Python Temel',keys:['tip dönüşümü','cast','int','str','float'],title:'Tip Dönüşümü',body:`<pre><code>int("42")       # 42
int("3.14")     # HATA (ValueError)
float("3.14")   # 3.14
str(42)         # "42"
bool(1)         # True

int(3.99)       # 3 (kırpma, yuvarlama değil)
round(3.99)     # 4

try:
    x = int(input())
except ValueError:
    x = 0</code></pre>`},
{id:'yorum',cat:'Python Temel',keys:['yorum','comment','açıklama','docstring'],title:'Yorumlar ve Docstring',body:`<pre><code># Tek satır yorum

"""
Çok satırlı
açıklama (string)
"""

def topla(a, b):
    """
    İki sayıyı toplar.

    Args:
        a (int): ilk sayı
        b (int): ikinci sayı
    Returns:
        int: toplam
    """
    return a + b

print(topla.__doc__)</code></pre>`},

/* ═══ PYTHON VERİ ═══ */
{id:'list',cat:'Python Veri',keys:['list','liste','dizi','array','append'],title:'Liste (list)',body:`<pre><code>liste = [1, 2, 3, "dört", True]

liste[0]        # 1
liste[-1]       # True
liste[1:3]      # [2, 3]
liste[::-1]     # ters

liste.append(5)         # sona ekle
liste.insert(0, 0)      # başa ekle
liste.remove("dört")    # değere göre sil
liste.pop()             # sonu sil
liste.pop(0)            # ilkini sil
liste[0] = 99           # güncelle

liste.sort()                    # yerinde
liste.sort(reverse=True)
sorted(liste)                   # yeni liste

len(liste)
liste.index(3)
3 in liste
liste.count(2)

[1,2] + [3,4]   # [1,2,3,4]
[0] * 5         # [0,0,0,0,0]</code></pre>`},
{id:'tuple',cat:'Python Veri',keys:['tuple','demet','sabit liste'],title:'Demet (tuple)',body:`<pre><code>t = (1, 2, 3)
t = 1, 2, 3             # parantez opsiyonel

t[0]                    # 1
t[-1]                   # 3

# t[0] = 99             # HATA (TypeError)

a, b, c = t             # a=1, b=2, c=3
a, *rest = t            # a=1, rest=[2,3]

tek = (1,)              # virgül şart!
tek = (1)               # bu int!

nokta = {(0,0): "orijin"}  # sözlük anahtarı olabilir</code></pre>`},
{id:'set',cat:'Python Veri',keys:['set','küme','birleşim','kesişim','union'],title:'Küme (set)',body:`<pre><code>s = {1, 2, 3}
s = set([1, 2, 3])
s = set()               # boş küme ({} DEĞİL!)

s.add(4)
s.discard(1)            # yoksa hata vermez
s.remove(2)             # yoksa hata verir
s.clear()

a = {1,2,3}; b = {2,3,4}
a | b        # birleşim: {1,2,3,4}
a & b        # kesişim: {2,3}
a - b        # fark: {1}
a ^ b        # simetrik fark: {1,4}

liste = [1, 1, 2, 3, 3]
tekil = list(set(liste))    # [1,2,3]</code></pre>`},
{id:'dict',cat:'Python Veri',keys:['dict','sözlük','key value','anahtar değer','hash'],title:'Sözlük (dict)',body:`<pre><code>kisi = {"ad": "Ali", "yas": 25}

kisi["ad"]              # "Ali"
kisi.get("yas")         # 25
kisi.get("yok", 0)      # 0

kisi["meslek"] = "Dev"
kisi.update({"yas": 26})

del kisi["meslek"]
kisi.pop("yas")
kisi.clear()

for k in kisi.keys(): print(k)
for v in kisi.values(): print(v)
for k, v in kisi.items(): print(k, v)

"ad" in kisi            # True

karesi = {x: x**2 for x in range(5)}</code></pre><p>Sıralı (3.7+): giriş sırası korunur.</p>`},
{id:'comp',cat:'Python Veri',keys:['comprehension','liste üreteci','üreteç'],title:'Comprehension',body:`<p><b>Liste:</b></p><pre><code>kare = [x**2 for x in range(5)]
cift_kare = [x**2 for x in range(10) if x % 2 == 0]</code></pre><p><b>Sözlük:</b></p><pre><code>karesi = {x: x**2 for x in range(5)}</code></pre><p><b>Küme:</b></p><pre><code>tekil = {x.lower() for x in ["A","a","B"]}</code></pre><p><b>Generator (parantez):</b></p><pre><code>gen = (x**2 for x in range(1000000))   # bellek dostu</code></pre>`},
{id:'slice',cat:'Python Veri',keys:['slice','dilim','kesit'],title:'Slice (Dilim)',body:`<pre><code>s = "Merhaba Dünya"
liste = [10, 20, 30, 40, 50]

s[0:7]          # "Merhaba"
s[:7]           # "Merhaba"
s[8:]           # "Dünya"
s[-5:]          # "Dünya"
s[::2]          # her 2.
s[::-1]         # ters

liste[1:3]      # [20, 30]
liste[::2]      # [10, 30, 50]
liste[::-1]     # [50,40,30,20,10]</code></pre>`},
{id:'stack-queue',cat:'Python Veri',keys:['stack','yığın','lifo','queue','kuyruk','fifo','deque'],title:'Stack, Queue, Deque',body:`<p><b>Stack (LIFO — Son giren ilk çıkar):</b></p><pre><code>y = []
y.append(1)     # push
y.append(2)
y.pop()         # 2 çıkar</code></pre><p><b>Queue (FIFO — İlk giren ilk çıkar):</b></p><pre><code>from collections import deque
q = deque()
q.append(1)     # enqueue
q.append(2)
q.popleft()     # 1 çıkar (hızlı)</code></pre><p><b>Neden deque?</b> <code>list.pop(0)</code> O(n), <code>deque.popleft()</code> O(1).</p>`},
{id:'shallow-copy',cat:'Python Veri',keys:['kopya','copy','shallow','deep'],title:'Kopyalama',body:`<pre><code>import copy

liste = [[1,2],[3,4]]

# Atama (aynı referans)
a = liste

# Shallow copy (iç listeler paylaşılır)
b = liste.copy()        # veya liste[:]
b[0][0] = 99
print(liste)            # [[99,2],[3,4]] — DEĞİŞTİ!

# Deep copy (tamamen bağımsız)
c = copy.deepcopy(liste)
c[0][0] = 0
print(liste)            # [[99,2],[3,4]] — etkilenmez</code></pre>`},
{id:'sorted-fonksiyon',cat:'Python Veri',keys:['sorted','sort','key','sıralama'],title:'sorted ve key',body:`<pre><code>liste = [3, 1, 2]
sorted(liste)                    # [1,2,3] — yeni
liste.sort()                     # yerinde

soyadlar = ["Ali Veli", "Ayşe Kaya"]
sorted(soyadlar, key=lambda x: x.split()[-1])

kisiler = [{"ad":"A","yas":30},{"ad":"B","yas":20}]
sorted(kisiler, key=lambda k: k["yas"])

sorted(liste, reverse=True)</code></pre>`},
{id:'enumerate-zip',cat:'Python Veri',keys:['enumerate','zip','döngü indeks'],title:'enumerate ve zip',body:`<p><b>enumerate — indeksli döngü:</b></p><pre><code>for i, harf in enumerate("abc"):
    print(i, harf)      # 0 a, 1 b, 2 c

for i, x in enumerate(liste, start=1):
    print(i, x)         # 1'den başla</code></pre><p><b>zip — paralel döngü:</b></p><pre><code>isimler = ["Ali", "Ayşe"]
yaslar = [25, 30]
for isim, yas in zip(isimler, yaslar):
    print(f"{isim} {yas}")

dict(zip(isimler, yaslar))   # {"Ali":25, "Ayşe":30}</code></pre>`},
{id:'len-min-max',cat:'Python Veri',keys:['len','min','max','sum','any','all'],title:'Yerleşik Fonksiyonlar',body:`<pre><code>len([1,2,3])            # 3
min([3,1,2])            # 1
max([3,1,2])            # 3
sum([1,2,3])            # 6
sum([1,2,3], start=10)  # 16

any([False, True, False])   # True
all([True, True, True])     # True

list("abc")             # ['a','b','c']
tuple([1,2])            # (1,2)
set([1,1,2])            # {1,2}
dict([("a",1),("b",2)]) # {'a':1,'b':2}</code></pre>`},
{id:'string-metotlar',cat:'Python Veri',keys:['str metotları','upper','lower','split','join','replace'],title:'String Metotları',body:`<pre><code>s = "  Merhaba Dünya  "

s.strip()               # "Merhaba Dünya"
s.upper()               # "  MERHABA DÜNYA  "
s.lower()
s.capitalize()
s.title()

s.split()               # ["Merhaba","Dünya"]
"a,b,c".split(",")      # ["a","b","c"]
"-".join(["a","b"])     # "a-b"

s.replace("a","A")
s.find("Dünya")         # 10 (yoksa -1)
s.index("Dünya")        # 10 (yoksa ValueError)
s.count("a")            # 3

s.startswith("  Me")    # True
s.endswith("  ")        # True

"abc".isalpha()         # True
"123".isdigit()         # True
"abc123".isalnum()      # True

"Ali".center(10, "*")   # "***Ali****"
"Ali".ljust(10)         # sola yasla
"Ali".rjust(10)         # sağa yasla
"Ali".zfill(5)          # "00Ali"</code></pre>`},
{id:'frozenset',cat:'Python Veri',keys:['frozenset','değiştirilemez küme'],title:'frozenset',body:`<pre><code>fs = frozenset([1, 2, 3])
# fs.add(4)   # HATA — değiştirilemez

# Kullanım: sözlük anahtarı olabilir
sozluk = {frozenset([1,2]): "bir-iki"}

fs | frozenset([4])     # yeni frozenset</code></pre>`},
{id:'nested',cat:'Python Veri',keys:['iç içe liste','nested','matris','2 boyutlu'],title:'İç İçe Yapılar',body:`<pre><code># Matris
matris = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
matris[1][2]        # 6

for satir in matris:
    for hucre in satir:
        print(hucre, end=" ")
    print()

transpoze = [[satir[i] for satir in matris] for i in range(3)]

kullanicilar = {
    "ali": {"yas": 25, "sehir": "Ankara"},
    "ayşe": {"yas": 30, "sehir": "İzmir"}
}
kullanicilar["ali"]["yas"]   # 25

# DİKKAT: aynı referans!
yanlis = [[0]*3] * 3
dogru = [[0]*3 for _ in range(3)]</code></pre>`},
{id:'unpacking',cat:'Python Veri',keys:['unpacking','açma','yıldız','args'],title:'Unpacking',body:`<pre><code>a, b, c = [1, 2, 3]

a, *ortanca, b = [1, 2, 3, 4, 5]
# a=1, ortanca=[2,3,4], b=5

def topla(*sayilar):
    return sum(sayilar)
topla(1, 2, 3)

liste = [1, 2, 3]
topla(*liste)           # liste'yi aç

def kisi(ad, yas):
    print(ad, yas)
bilgi = {"ad": "Ali", "yas": 25}
kisi(**bilgi)           # sözlüğü aç</code></pre>`},
{id:'range-fonk',cat:'Python Veri',keys:['range','lazy','aralık'],title:'range() — Lazy Dizi',body:`<pre><code>range(5)            # 0,1,2,3,4
range(1, 10)        # 1..9
range(1, 10, 2)     # 1,3,5,7,9
range(10, 0, -1)    # 10,9,...,1

list(range(5))      # [0,1,2,3,4]

for i in range(1000000):
    pass            # hızlı, az bellek</code></pre>`},
{id:'truthy',cat:'Python Veri',keys:['truthy','falsy','doğruluk değeri'],title:'Truthy / Falsy',body:`<p><b>Falsy (False sayılan):</b></p><ul><li><code>False</code></li><li><code>None</code></li><li><code>0</code>, <code>0.0</code></li><li><code>""</code> (boş string)</li><li><code>[]</code>, <code>()</code>, <code>{}</code>, <code>set()</code></li></ul><p><b>Diğer her şey Truthy.</b></p><pre><code>if liste:
    isle(liste)     # boş değilse

# Yerine:
if len(liste) > 0:  # gereksiz uzun</code></pre>`},
{id:'dict-get-vs',cat:'Python Veri',keys:['get','dict erişim','keyerror','setdefault'],title:'dict.get() vs dict[]',body:`<pre><code>d = {"a": 1}

d["a"]          # 1
# d["b"]        # KeyError!

d.get("a")      # 1
d.get("b")      # None
d.get("b", 0)   # 0

d.setdefault("c", 3)    # {"a":1, "c":3}
d.setdefault("a", 99)   # {"a":1} — değişmez

from collections import defaultdict
sayac = defaultdict(int)
sayac["x"] += 1         # KeyError yok!</code></pre>`}
);

console.log('[KB-2] yüklendi: ' + OZ.KB.length + ' toplam konu');
})();
