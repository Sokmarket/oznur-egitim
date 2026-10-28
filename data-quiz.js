/* ÖZnur Eğitim — Quiz: 30 soru */
(function(){
'use strict';
OZ.QUIZ = OZ.QUIZ || [];
OZ.QUIZ.push(
{q:'Bilgisayarın 4 temel işlevi?',opts:['Girdi,işlem,çıktı,depolama','Açma,kapama,bekleme,silme','Yazma,okuma,çizme,boyama','Veri,bilgi,görüntü,ses'],ans:0,tip:'Donanım'},
{q:'RAM ile SSD farkı?',opts:['RAM kalıcı,SSD geçici','RAM geçici,SSD kalıcı','İkisi aynı','RAM daha büyük'],ans:1,tip:'Donanım'},
{q:'CPU komut döngüsü?',opts:['Getir→Çözümle→Yürüt','Yürüt→Getir→Çözümle','Çözümle→Yürüt→Getir','Getir→Yürüt→Çözümle'],ans:0,tip:'Donanım'},
{q:'Kernel nedir?',opts:['Kullanıcı arayüzü','İşletim sisteminin çekirdeği','Uygulama','Dosya türü'],ans:1,tip:'OS'},
{q:'Android\'de Java/Kotlin çalıştıran?',opts:['HAL','ART','Kernel','Framework'],ans:1,tip:'OS'},
{q:'Linux\'ta her şey nedir?',opts:['Dosya','Süreç','Modül','Aygıt'],ans:0,tip:'Linux'},
{q:'Termux paket güncelleme?',opts:['pkg update','pip update','update-all','termux-update'],ans:0,tip:'Linux'},
{q:'chmod 755 ne demek?',opts:['rwxr-xr-x','rw-r--r--','rwxrwxrwx','---------'],ans:0,tip:'Linux'},
{q:'10 // 3 sonucu?',opts:['3.33','3','4','1'],ans:1,tip:'Python'},
{q:'2 ** 10 sonucu?',opts:['1024','100','20','12'],ans:0,tip:'Python'},
{q:'f-string hangi sürümden?',opts:['3.5','3.6','3.7','3.10'],ans:1,tip:'Python'},
{q:'Liste üreteci hangisi?',opts:['[x for x in range(5)]','list(x)','{x}','(x)'],ans:0,tip:'Python'},
{q:'Sözlükte değerler için?',opts:['keys()','values()','items()','get()'],ans:1,tip:'Python'},
{q:'Tuple ile list farkı?',opts:['Tuple değiştirilemez','Tuple hızlı','Tuple sadece sayı','Fark yok'],ans:0,tip:'Python'},
{q:'range(5) hangi değerler?',opts:['0,1,2,3,4','1,2,3,4,5','0,1,2,3,4,5','1,2,3,4'],ans:0,tip:'Python'},
{q:'Dış değişkeni değiştirmek için?',opts:['global','outer','extern','extern-global'],ans:0,tip:'Python'},
{q:'Her koşulda çalışan blok?',opts:['try','except','else','finally'],ans:3,tip:'Python'},
{q:'Örnek metodun ilk parametresi?',opts:['cls','self','this','me'],ans:1,tip:'Python'},
{q:'with ne sağlar?',opts:['Otomatik kapatma','Şifreleme','Sıkıştırma','Yedekleme'],ans:0,tip:'Python'},
{q:'Dosya modu "a" ne yapar?',opts:['Okur','Yazar(baştan)','Ekler(sona)','Siler'],ans:2,tip:'Python'},
{q:'True and False?',opts:['True','False','Hata','None'],ans:1,tip:'Python'},
{q:'bool([]) ne döner?',opts:['True','False','Hata','None'],ans:1,tip:'Python'},
{q:'lambda nedir?',opts:['Tek satır fonksiyon','Sınıf','Modül','Dekoratör'],ans:0,tip:'Python'},
{q:'Big O\'da O(1)?',opts:['Sabit','Doğrusal','Karesel','Üstel'],ans:0,tip:'Algoritma'},
{q:'İkili arama için şart?',opts:['Sıralı liste','Boş liste','Sadece sayı','Şart yok'],ans:0,tip:'Algoritma'},
{q:'Merge sort karmaşıklık?',opts:['O(n)','O(n log n)','O(n²)','O(2ⁿ)'],ans:1,tip:'Algoritma'},
{q:'Özyinelemede zorunlu?',opts:['Taban durum','Döngü','Sınıf','Modül'],ans:0,tip:'Algoritma'},
{q:'Sanal ortam komutu?',opts:['python -m venv .venv','pip venv','virtualenv-init','python --venv'],ans:0,tip:'Araçlar'},
{q:'Git\'te hazırlamak?',opts:['git add','git commit','git push','git init'],ans:0,tip:'Araçlar'},
{q:'SQL tüm kayıtlar?',opts:['SELECT * FROM tablo','GET * FROM tablo','SHOW * FROM tablo','FETCH ALL tablo'],ans:0,tip:'Veri'}
);
OZ.shuffleQuiz = function(){ return OZ.QUIZ.map((_,i) => i).sort(() => Math.random()-0.5); };
})();
