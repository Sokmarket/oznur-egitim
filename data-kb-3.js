/* ÖZnur Eğitim — KB 3: Python Orta, İleri, Algoritma (37 konu) */
(function(){
'use strict';
OZ.KB = OZ.KB || [];

OZ.KB.push(
/* ═══ PYTHON ORTA ═══ */
{id:'fonksiyon',cat:'Python Orta',keys:['fonksiyon','def','return','parametre','argüman'],title:'Fonksiyonlar',body:`<pre><code>def topla(a, b):
    return a + b

topla(3, 5)     # 8

def selam(isim="Dünya"):
    print(f"Selam {isim}")
selam()         # Selam Dünya</code></pre><p><b>Kurallar:</b></p><ul><li><code>def</code> ile tanımla</li><li>Girinti gövdeyi belirler</li><li><code>return</code> yoksa <code>None</code> döner</li><li>Fonksiyon bir nesnedir — değişkene atanabilir</li></ul>`},
{id:'parametre-turleri',cat:'Python Orta',keys:['args','kwargs','keyword','positional','parametre'],title:'Parametre Türleri',body:`<pre><code># Pozisyonel
def f(a, b): pass
f(1, 2)

# Anahtar sözcük
f(b=2, a=1)

# Varsayılan
def f(a, b=5): pass

# *args — sınırsız pozisyonel
def f(*sayilar):
    return sum(sayilar)
f(1, 2, 3, 4)   # 10

# **kwargs — sınırsız anahtar sözcük
def f(**bilgi):
    for k, v in bilgi.items():
        print(k, v)
f(ad="Ali", yas=25)

# Karışık sıra
def f(a, b=0, *args, **kwargs): pass</code></pre>`},
{id:'scope',cat:'Python Orta',keys:['scope','kapsam','global','nonlocal','legb'],title:'Kapsam (LEGB)',body:`<p><b>L</b>ocal → <b>E</b>nclosing → <b>G</b>lobal → <b>B</b>uilt-in</p><pre><code>x = "global"

def dis():
    x = "enclosing"
    def ic():
        nonlocal x
        x = "değişti"
    ic()
    print(x)            # "değişti"

def degistir():
    global x
    x = "yeni"

degistir()
print(x)                # "yeni"</code></pre>`},
{id:'lambda',cat:'Python Orta',keys:['lambda','map','filter','reduce','anonim'],title:'Lambda, map, filter, reduce',body:`<pre><code>kare = lambda x: x**2
kare(5)         # 25

topla = lambda a, b: a + b

sayilar = [1, 2, 3, 4]
list(map(lambda x: x*2, sayilar))       # [2,4,6,8]
list(filter(lambda x: x%2==0, sayilar)) # [2,4]

from functools import reduce
reduce(lambda a,b: a+b, sayilar)        # 10</code></pre>`},
{id:'modul',cat:'Python Orta',keys:['modül','import','paket','package'],title:'Modüller ve Paketler',body:`<pre><code>import math
math.sqrt(16)           # 4.0

from math import sqrt, pi
sqrt(25)

import numpy as np
np.array([1,2,3])

from os.path import join

import pandas as pd</code></pre><p><b>Kendi modülün:</b> <code>yardimci.py</code> oluştur → <code>import yardimci</code></p><p><b>Paket:</b> İçinde <code>__init__.py</code> olan klasör</p><pre><code>proje/
  __init__.py
  modul1.py
  alt/
    __init__.py
    modul2.py</code></pre>`},
{id:'dosya',cat:'Python Orta',keys:['dosya','file','open','read','write','with'],title:'Dosya İşlemleri',body:`<pre><code># Yazma
with open("a.txt", "w", encoding="utf-8") as f:
    f.write("Merhaba\\n")

# Ekleme
with open("a.txt", "a", encoding="utf-8") as f:
    f.write("Satır\\n")

# Okuma
with open("a.txt", "r", encoding="utf-8") as f:
    icerik = f.read()

# Satır satır
with open("a.txt") as f:
    for satir in f:
        print(satir.strip())

# Tüm satırlar liste
with open("a.txt") as f:
    satirlar = f.readlines()</code></pre><p><b>Modlar:</b> r (oku), w (yaz), a (ekle), r+ (oku+yaz), b (binary)</p><p><b>with</b> → otomatik kapatır, istisnada bile.</p>`},
{id:'exception',cat:'Python Orta',keys:['try','except','finally','hata','exception','raise'],title:'Hata Yönetimi',body:`<pre><code>try:
    x = int("abc")
except ValueError:
    print("Sayı değil")
except (TypeError, KeyError) as e:
    print("Hata:", e)
except Exception as e:
    print("Bilinmeyen:", e)
else:
    print("Hata yok")
finally:
    print("Her zaman çalışır")</code></pre><p><b>Sık istisnalar:</b></p><ul><li><code>ValueError</code> — geçersiz değer</li><li><code>TypeError</code> — yanlış tip</li><li><code>KeyError</code> — sözlükte anahtar yok</li><li><code>IndexError</code> — liste dışı</li><li><code>FileNotFoundError</code> — dosya yok</li><li><code>ZeroDivisionError</code> — sıfıra bölme</li></ul>`},
{id:'custom-exception',cat:'Python Orta',keys:['özel hata','custom exception','raise'],title:'Özel İstisnalar',body:`<pre><code>class BenimHatam(Exception):
    pass

class YasHatasi(ValueError):
    def __init__(self, yas):
        super().__init__(f"Geçersiz yaş: {yas}")
        self.yas = yas

try:
    raise YasHatasi(-5)
except YasHatasi as e:
    print(e)        # Geçersiz yaş: -5</code></pre>`},
{id:'context-manager',cat:'Python Orta',keys:['context manager','with','enter','exit'],title:'Context Manager',body:`<pre><code>class Kaynak:
    def __enter__(self):
        print("Açıldı")
        return self
    def __exit__(self, exc_type, exc_val, tb):
        print("Kapandı")
        return False

with Kaynak() as k:
    print("İçerde")

# contextlib ile kolay
from contextlib import contextmanager

@contextmanager
def kaynak():
    print("Açıldı")
    try:
        yield
    finally:
        print("Kapandı")</code></pre>`},
{id:'json-csv',cat:'Python Orta',keys:['json','csv','veri formatı'],title:'JSON ve CSV',body:`<p><b>JSON:</b></p><pre><code>import json

veri = {"ad": "Ali", "yas": 25}
with open("a.json", "w", encoding="utf-8") as f:
    json.dump(veri, f, ensure_ascii=False, indent=2)

with open("a.json") as f:
    v = json.load(f)

json.loads('{"a":1}')
json.dumps({"a":1})</code></pre><p><b>CSV:</b></p><pre><code>import csv

with open("a.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["ad", "yas"])
    w.writerow(["Ali", 25])

with open("a.csv") as f:
    for satir in csv.reader(f):
        print(satir)

with open("a.csv") as f:
    for row in csv.DictReader(f):
        print(row["ad"])</code></pre>`},
{id:'regex',cat:'Python Orta',keys:['regex','düzenli ifade','re','pattern'],title:'Düzenli İfadeler (re)',body:`<pre><code>import re

re.match(r"^\\d+$", "123")
re.search(r"\\d+", "abc123def")
re.findall(r"\\d+", "a1b2c3")      # ['1','2','3']
re.sub(r"\\s+", " ", "a   b")
re.split(r"[,;]", "a,b;c")

m = re.search(r"(\\d{3})-(\\d{4})", "555-1234")
m.group(0)      # "555-1234"
m.group(1)      # "555"

patern = re.compile(r"\\d+")
patern.findall("a1b22")</code></pre><p><b>Kısayollar:</b> <code>\\d</code> rakam, <code>\\w</code> harf/rakam, <code>\\s</code> boşluk, <code>.</code> her şey</p><p><b>Niceleyici:</b> <code>+</code> 1+, <code>*</code> 0+, <code>?</code> 0/1, <code>{n}</code> tam n</p>`},
{id:'iterable',cat:'Python Orta',keys:['iterator','iterable','iter','next'],title:'Iterator ve Iterable',body:`<p><b>Iterable:</b> Döngü yapılabilir (list, str, dict, range).</p><p><b>Iterator:</b> <code>next()</code> ile sıradaki elemanı veren nesne.</p><pre><code>liste = [1, 2, 3]
it = iter(liste)
next(it)        # 1
next(it)        # 2
next(it)        # 3
next(it)        # StopIteration

class Sayac:
    def __init__(self, max):
        self.max = max
        self.n = 0
    def __iter__(self): return self
    def __next__(self):
        if self.n >= self.max:
            raise StopIteration
        self.n += 1
        return self.n - 1</code></pre>`},
{id:'generator',cat:'Python Orta',keys:['generator','yield','üreteç','lazy'],title:'Generator ve yield',body:`<pre><code>def say(max):
    for i in range(max):
        yield i

for n in say(5):
    print(n)        # 0,1,2,3,4

def kareler(n):
    for i in range(n):
        yield i**2

sum(kareler(1000000))   # bellek harcamaz

gen = (x**2 for x in range(10))
next(gen)               # 0</code></pre><p><b>Fark:</b> <code>return</code> bitirir, <code>yield</code> duraklatır.</p>`},
{id:'comprehension-adv',cat:'Python Orta',keys:['comprehension','üreteç','nested'],title:'Comprehension (İleri)',body:`<pre><code># Koşullu
cift = [x for x in range(10) if x % 2 == 0]

# if-else
isaret = ["+" if x>=0 else "-" for x in [1,-2,3]]

# İç içe
matris = [[1,2],[3,4]]
duz = [x for satir in matris for x in satir]  # [1,2,3,4]

# Sözlük
karesi = {x: x**2 for x in range(5)}

# Sözlük filtre
sadece_buyuk = {k:v for k,v in kisi.items() if v > 18}

# Küme
tekil = {x.lower() for x in ["A","a","B"]}

# Generator
gen = (x**2 for x in range(1000000))</code></pre>`},

/* ═══ PYTHON İLERİ ═══ */
{id:'sinif',cat:'Python İleri',keys:['class','sınıf','oop','nesne','object','self'],title:'Sınıf ve Nesne',body:`<pre><code>class Kisi:
    tur = "insan"        # sınıf değişkeni
    sayac = 0

    def __init__(self, ad, yas):
        self.ad = ad     # örnek değişkeni
        self.yas = yas
        Kisi.sayac += 1

    def selamla(self):
        return f"Merhaba {self.ad}"

k = Kisi("Ali", 25)
k.selamla()         # "Merhaba Ali"
k.ad                # "Ali"
Kisi.sayac          # 1</code></pre><p><b>self:</b> Örneğin kendisi. Java'daki <code>this</code>.</p>`},
{id:'kalitim',cat:'Python İleri',keys:['kalıtım','inheritance','super','miras'],title:'Kalıtım',body:`<pre><code>class Hayvan:
    def __init__(self, isim):
        self.isim = isim
    def ses(self):
        return "..."

class Kopek(Hayvan):
    def __init__(self, isim, cins):
        super().__init__(isim)
        self.cins = cins
    def ses(self):
        return "Hav hav"

class Kus(Hayvan):
    def ses(self):
        return "Cik cik"

k = Kopek("Karabaş", "Terrier")
k.ses()             # "Hav hav"
isinstance(k, Hayvan)   # True</code></pre><p><b>super():</b> Üst sınıfa erişim. Çoklu kalıtımda MRO kullanır.</p>`},
{id:'override',cat:'Python İleri',keys:['override','ezme','polymorphism','polimorfizm'],title:'Override ve Polimorfizm',body:`<pre><code>class Sekil:
    def alan(self):
        raise NotImplementedError

class Daire(Sekil):
    def __init__(self, r): self.r = r
    def alan(self): return 3.14 * self.r ** 2

class Kare(Sekil):
    def __init__(self, k): self.k = k
    def alan(self): return self.k ** 2

sekiller = [Daire(5), Kare(3)]
for s in sekiller:
    print(s.alan())     # polimorfizm</code></pre>`},
{id:'encapsulation',cat:'Python İleri',keys:['encapsulation','kapsülleme','private'],title:'Kapsülleme',body:`<pre><code>class Hesap:
    def __init__(self):
        self.halka = 0          # public
        self._ic = 0            # "protected"
        self.__gizli = 0        # name mangling

    def _yardimci(self):
        pass

    def __gizli_metot(self):
        pass

h = Hesap()
h.halka
h._ic                       # çalışır ama "kötü"
h._Hesap__gizli             # name mangling ile erişilebilir</code></pre><p>Python'da gerçek private yok — convention.</p>`},
{id:'property',cat:'Python İleri',keys:['property','getter','setter'],title:'property — Getter/Setter',body:`<pre><code>class Kisi:
    def __init__(self, ad):
        self._ad = ad

    @property
    def ad(self):
        return self._ad

    @ad.setter
    def ad(self, v):
        if not v:
            raise ValueError("Boş olamaz")
        self._ad = v

k = Kisi("Ali")
k.ad            # "Ali"
k.ad = "Veli"
# k.ad = ""     # ValueError</code></pre>`},
{id:'dunder',cat:'Python İleri',keys:['dunder','str','repr','eq','operator overloading'],title:'Dunder Metotları',body:`<pre><code>class Para:
    def __init__(self, m):
        self.m = m

    def __str__(self):          # print()
        return f"{self.m} TL"
    def __repr__(self):         # debug
        return f"Para({self.m})"
    def __eq__(self, o):        # ==
        return self.m == o.m
    def __lt__(self, o):        # <
        return self.m < o.m
    def __add__(self, o):       # +
        return Para(self.m + o.m)
    def __len__(self):          # len()
        return len(str(self.m))

print(Para(50))         # 50 TL
Para(10) + Para(20)     # Para(30)
Para(5) < Para(10)      # True</code></pre>`},
{id:'classmethod',cat:'Python İleri',keys:['classmethod','staticmethod'],title:'classmethod ve staticmethod',body:`<pre><code>class Kisi:
    sayac = 0

    def __init__(self, ad):
        self.ad = ad
        Kisi.sayac += 1

    @classmethod
    def toplam(cls):        # cls = sınıf
        return cls.sayac

    @staticmethod
    def selam():            # bağımsız
        return "Merhaba"

    @classmethod
    def from_str(cls, s):
        return cls(s)

Kisi.toplam()           # 0
k = Kisi.from_str("Ali")
Kisi.toplam()           # 1
Kisi.selam()            # "Merhaba"</code></pre>`},
{id:'abstract',cat:'Python İleri',keys:['abstract','soyut sınıf','abc','interface'],title:'Abstract Sınıf',body:`<pre><code>from abc import ABC, abstractmethod

class Sekil(ABC):
    @abstractmethod
    def alan(self):
        pass

# s = Sekil()   # HATA — soyut sınıf

class Kare(Sekil):
    def __init__(self, k): self.k = k
    def alan(self): return self.k ** 2

k = Kare(5)
k.alan()        # 25</code></pre>`},
{id:'typing',cat:'Python İleri',keys:['type hints','typing','tip ipuçları','mypy'],title:'Type Hints',body:`<pre><code>def topla(a: int, b: int) -> int:
    return a + b

def isimler() -> list[str]:
    return ["Ali", "Ayşe"]

from typing import Optional, Union

def bul(x: int) -> Optional[str]:
    return None if x < 0 else "bulundu"

def isle(x: int | None) -> None:    # 3.10+
    pass

# Kontrol:
# pip install mypy
# mypy dosya.py</code></pre>`},
{id:'decorator',cat:'Python İleri',keys:['decorator','dekoratör','wrapper'],title:'Dekoratörler',body:`<pre><code>import functools

def logla(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        print(f"Çağrıldı: {f.__name__}")
        return f(*args, **kwargs)
    return wrapper

@logla
def selam(ad):
    print(f"Selam {ad}")

selam("Ali")
# Çağrıldı: selam
# Selam Ali

# Parametreli
def tekrar(n):
    def deco(f):
        @functools.wraps(f)
        def wrapper(*a, **kw):
            for _ in range(n):
                f(*a, **kw)
        return wrapper
    return deco

@tekrar(3)
def merhaba(): print("Merhaba")</code></pre>`},
{id:'dataclass',cat:'Python İleri',keys:['dataclass','veri sınıfı'],title:'dataclass (3.7+)',body:`<pre><code>from dataclasses import dataclass, field

@dataclass
class Kisi:
    ad: str
    yas: int = 0
    etiketler: list = field(default_factory=list)

k = Kisi("Ali", 25)
print(k)        # Kisi(ad='Ali', yas=25, etiketler=[])
k == Kisi("Ali", 25)    # True

@dataclass(frozen=True)
class Nokta:
    x: int
    y: int</code></pre><p>__init__, __repr__, __eq__ otomatik gelir.</p>`},
{id:'mro',cat:'Python İleri',keys:['mro','çoklu kalıtım','multiple inheritance'],title:'Çoklu Kalıtım ve MRO',body:`<pre><code>class A:
    def selam(self): return "A"

class B(A):
    def selam(self): return "B"

class C(A):
    def selam(self): return "C"

class D(B, C):
    pass

d = D()
d.selam()           # "B" — MRO: D → B → C → A
D.__mro__           # (D, B, C, A, object)

class D2(B, C):
    def selam(self):
        return "D2+" + super().selam()</code></pre><p><b>Elmas problemi:</b> C3 doğrusallaştırma.</p>`},
{id:'slots',cat:'Python İleri',keys:['slots','bellek optimizasyonu'],title:'__slots__',body:`<pre><code>class Nokta:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y

n = Nokta(1, 2)
# n.z = 3   # HATA

# Faydası: milyonlarca nesnede bellek
# Dezavantaj: esneklik kaybı</code></pre>`},

/* ═══ ALGORİTMA ═══ */
{id:'bigo',cat:'Algoritma',keys:['bigo','big o','karmaşıklık','complexity'],title:'Big O Notasyonu',body:`<p>Algoritmanın büyüme hızı.</p><ul><li><b>O(1):</b> Sabit — <code>liste[0]</code></li><li><b>O(log n):</b> Logaritmik — binary search</li><li><b>O(n):</b> Doğrusal — linear search</li><li><b>O(n log n):</b> merge sort</li><li><b>O(n²):</b> Karesel — bubble sort</li><li><b>O(2ⁿ):</b> Üstel — naif fibonacci</li></ul>`},
{id:'linear-search',cat:'Algoritma',keys:['linear search','doğrusal arama'],title:'Doğrusal Arama — O(n)',body:`<pre><code>def ara(liste, hedef):
    for i, x in enumerate(liste):
        if x == hedef:
            return i
    return -1

ara([3,1,4,1,5], 4)   # 2</code></pre><p>Sıralanmamış listede tek seçenek.</p>`},
{id:'binary-search',cat:'Algoritma',keys:['binary search','ikili arama'],title:'İkili Arama — O(log n)',body:`<pre><code>def ikili_ara(liste, hedef):
    sol, sag = 0, len(liste) - 1
    while sol <= sag:
        orta = (sol + sag) // 2
        if liste[orta] == hedef:
            return orta
        elif liste[orta] < hedef:
            sol = orta + 1
        else:
            sag = orta - 1
    return -1

ikili_ara([1,3,5,7,9,11], 7)   # 3</code></pre><p><b>Şart:</b> Liste <b>sıralı</b> olmalı.</p>`},
{id:'bubble-sort',cat:'Algoritma',keys:['bubble sort','baloncuk sıralama'],title:'Bubble Sort — O(n²)',body:`<pre><code>def bubble(a):
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
    return a

bubble([3,1,4,1,5])   # [1,1,3,4,5]</code></pre><p>Eğitim amaçlı. Gerçekte <code>list.sort()</code> (Timsort).</p>`},
{id:'merge-sort',cat:'Algoritma',keys:['merge sort','birleştirme'],title:'Merge Sort — O(n log n)',body:`<pre><code>def merge_sort(a):
    if len(a) <= 1:
        return a
    orta = len(a) // 2
    sol = merge_sort(a[:orta])
    sag = merge_sort(a[orta:])
    return birlestir(sol, sag)

def birlestir(sol, sag):
    sonuc = []
    i = j = 0
    while i < len(sol) and j < len(sag):
        if sol[i] <= sag[j]:
            sonuc.append(sol[i]); i += 1
        else:
            sonuc.append(sag[j]); j += 1
    sonuc.extend(sol[i:])
    sonuc.extend(sag[j:])
    return sonuc

merge_sort([3,1,4,1,5,9,2,6])   # [1,1,2,3,4,5,6,9]</code></pre>`},
{id:'quick-sort',cat:'Algoritma',keys:['quick sort','hızlı sıralama','pivot'],title:'Quick Sort — O(n log n)',body:`<pre><code>def quick_sort(a):
    if len(a) <= 1:
        return a
    pivot = a[len(a) // 2]
    sol = [x for x in a if x < pivot]
    orta = [x for x in a if x == pivot]
    sag = [x for x in a if x > pivot]
    return quick_sort(sol) + orta + quick_sort(sag)

quick_sort([3,1,4,1,5,9,2,6])</code></pre><p>Ortalama hızlı, en kötü O(n²).</p>`},
{id:'recursion',cat:'Algoritma',keys:['recursion','özyineleme','faktoriyel','fibonacci'],title:'Özyineleme',body:`<pre><code>def faktoriyel(n):
    if n <= 1:          # taban durum
        return 1
    return n * faktoriyel(n - 1)

faktoriyel(5)           # 120

def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

from functools import lru_cache

@lru_cache
def fib_hizli(n):
    if n < 2: return n
    return fib_hizli(n-1) + fib_hizli(n-2)</code></pre><p><b>Kural:</b> Taban durum şart, yoksa RecursionError.</p>`},
{id:'dynamic',cat:'Algoritma',keys:['dynamic programming','dp','dinamik'],title:'Dinamik Programlama',body:`<p>Alt problemleri bir kez çöz, sonucu sakla.</p><pre><code># Memoization
memo = {}
def fib(n):
    if n in memo: return memo[n]
    if n < 2: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]

# Tabulation
def fib_dp(n):
    if n < 2: return n
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return b</code></pre>`},
{id:'graph',cat:'Algoritma',keys:['graph','graf','bfs','dfs'],title:'Graf: BFS ve DFS',body:`<pre><code>from collections import deque

graf = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
}

def bfs(graf, bas):
    ziyaret = {bas}
    q = deque([bas])
    sira = []
    while q:
        n = q.popleft()
        sira.append(n)
        for k in graf[n]:
            if k not in ziyaret:
                ziyaret.add(k)
                q.append(k)
    return sira

def dfs(graf, bas, ziyaret=None):
    if ziyaret is None: ziyaret = set()
    ziyaret.add(bas)
    sira = [bas]
    for k in graf[bas]:
        if k not in ziyaret:
            sira += dfs(graf, k, ziyaret)
    return sira

bfs(graf, 'A')   # ['A','B','C','D']</code></pre><p><b>BFS:</b> Kısa yol. <b>DFS:</b> Derinlik.</p>`}
);

console.log('[KB-3] yüklendi: ' + OZ.KB.length + ' toplam konu');
})();
