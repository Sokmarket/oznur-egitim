/* ÖZnur Eğitim — KB 1: Donanım, OS, Linux, Termux (~35 konu) */
(function(){
'use strict';
OZ.KB = OZ.KB || [];

OZ.KB.push(
/* ═══ DONANIM ═══ */
{id:'bilgisayar',cat:'Donanım',keys:['bilgisayar','computer','bilgisayar nedir'],title:'Bilgisayar Nedir?',body:`<p>Veriyi alan, komutlara göre işleyen, sonuç üreten ve gerektiğinde saklayan elektronik sistem.</p><p><b>4 temel işlev:</b></p><ul><li><b>Girdi:</b> Klavye, fare, mikrofon</li><li><b>İşlem:</b> CPU</li><li><b>Çıktı:</b> Ekran, yazıcı</li><li><b>Depolama:</b> SSD/HDD</li></ul><p><b>Örnek:</b> <code>15+25</code> → girdi, işlem, çıktı.</p>`},
{id:'veri-bilgi',cat:'Donanım',keys:['veri','bilgi','data','information'],title:'Veri ve Bilgi',body:`<p><b>Veri:</b> Ham değerler, anlamsız. Örn: <code>18</code></p><p><b>Bilgi:</b> İşlenmiş, anlamlı. Örn: <code>18°C → Bugün 18 derece</code></p><ul><li><code>70, 80, 90</code> → veri</li><li><code>Ortalama = 80</code> → bilgi</li></ul><p><b>Piramit:</b> Veri → Bilgi → Bilgelik</p>`},
{id:'cpu',cat:'Donanım',keys:['cpu','işlemci','processor','alu','cu'],title:'CPU (İşlemci)',body:`<p>Komutları yürüten, hesaplama yapan temel bileşen. Bilgisayarın beyni.</p><p><b>Ana parçaları:</b></p><ul><li><b>ALU:</b> Aritmetik + mantık</li><li><b>CU:</b> Kontrol birimi</li><li><b>Yazmaçlar:</b> En hızlı küçük bellek</li><li><b>Cache:</b> L1/L2/L3 tampon</li></ul><p><b>Komut döngüsü:</b> Getir → Çözümle → Yürüt</p>`},
{id:'ram',cat:'Donanım',keys:['ram','bellek','memory'],title:'RAM (Geçici Bellek)',body:`<p>Çalışan programların verilerinin tutulduğu <b>geçici</b> bellek.</p><ul><li>Hızlı erişim (ns seviyesi)</li><li>Elektrik kesilince <b>silinir</b></li><li>Kapasite = aynı anda açık uygulama</li></ul><p><b>RAM ≠ Disk:</b> RAM geçici, SSD/HDD kalıcı.</p>`},
{id:'ssd',cat:'Donanım',keys:['ssd','hdd','depolama','disk'],title:'SSD ve HDD',body:`<p><b>HDD:</b> Manyetik plaka, hareketli parça, ucuz, yavaş.</p><p><b>SSD:</b> Flash bellek, sessiz, hızlı, dayanıklı.</p><p>HDD ~100 MB/s · SSD ~500+ MB/s</p><p><b>Günlük kural:</b> İşletim sistemi SSD'ye, arşiv HDD'ye.</p>`},
{id:'gpu',cat:'Donanım',keys:['gpu','ekran kartı','grafik'],title:'GPU (Ekran Kartı)',body:`<p>Grafik işlemlerini paralel yapan birim. Binlerce küçük çekirdek.</p><ul><li>Oyun, video düzenleme</li><li><b>Yapay zeka</b> eğitimi</li></ul><p><b>CPU vs GPU:</b> CPU az güçlü çekirdek (4-16), GPU çok basit çekirdek (binlerce).</p>`},
{id:'anakart',cat:'Donanım',keys:['anakart','motherboard'],title:'Anakart',body:`<p>Tüm bileşenleri bağlayan ana devre kartı.</p><ul><li>CPU soketi</li><li>RAM yuvaları</li><li>PCIe yuvası (GPU, SSD)</li><li>USB, ses, ağ portları</li><li>BIOS/UEFI çipi</li></ul><p><b>Uyum:</b> CPU soketi ve RAM tipi (DDR4/DDR5) anakartla eşleşmeli.</p>`},
{id:'bios',cat:'Donanım',keys:['bios','uefi','boot'],title:'BIOS / UEFI',body:`<p>Bilgisayar açılırken ilk çalışan yazılım.</p><ul><li><b>POST:</b> Donanım testi</li><li><b>Boot:</b> Hangi diskten açılsın</li><li><b>UEFI:</b> Modern BIOS (grafik, fare, büyük disk)</li></ul><p><b>Giriş tuşu:</b> DEL, F2, F10</p>`},
{id:'port',cat:'Donanım',keys:['usb','port','hdmi','type-c'],title:'Portlar',body:`<ul><li><b>USB-A:</b> Klasik dikdörtgen</li><li><b>USB-C:</b> Ters çevrilebilir, hızlı şarj, video</li><li><b>HDMI/DP:</b> Ekran</li><li><b>3.5mm Jak:</b> Ses</li><li><b>RJ45:</b> Ethernet</li></ul>`},
{id:'bit-byte',cat:'Donanım',keys:['bit','byte','kb','mb','gb'],title:'Bit, Byte ve Birimler',body:`<p><b>Bit:</b> 0 veya 1</p><p><b>Byte:</b> 8 bit = 1 karakter</p><ul><li>1 KB = 1024 byte</li><li>1 MB = 1024 KB</li><li>1 GB = 1024 MB</li><li>1 TB = 1024 GB</li></ul><p><b>Not:</b> İnternet hızı genelde <b>bit</b> (Mbps), dosya boyutu <b>byte</b> (MB).</p>`},

/* ═══ İŞLETİM SİSTEMİ ═══ */
{id:'os',cat:'İşletim Sistemi',keys:['işletim sistemi','os','operating system'],title:'İşletim Sistemi',body:`<p>Donanımı yöneten, uygulamalara hizmet veren temel yazılım.</p><ul><li>Süreç yönetimi</li><li>Bellek yönetimi</li><li>Dosya sistemi</li><li>G/Ç yönetimi</li><li>Güvenlik ve izinler</li></ul><p><b>Örnek:</b> Windows, Linux, macOS, Android, iOS</p>`},
{id:'kernel',cat:'İşletim Sistemi',keys:['kernel','çekirdek'],title:'Kernel (Çekirdek)',body:`<p>İşletim sisteminin donanımı yöneten çekirdek bileşeni.</p><ul><li>İşlem/thread planlama</li><li>Bellek yönetimi</li><li>Sistem çağrıları (syscall)</li><li>Sürücü yönetimi</li></ul><p><b>Kullanıcı vs Çekirdek alanı:</b> Uygulamalar sınırlı yetkiyle çalışır.</p><p><b>Tipler:</b> Monolithic (Linux), Microkernel, Hybrid (Windows)</p>`},
{id:'process',cat:'İşletim Sistemi',keys:['süreç','process','thread'],title:'Süreç ve Thread',body:`<p><b>Süreç:</b> Çalışan programın örneği, kendi belleği.</p><p><b>Thread:</b> Süreç içindeki hafif çalışma birimi, belleği paylaşır.</p><ul><li>Her süreç en az 1 thread</li><li>Thread iletişimi hızlı, süreç yavaş</li><li>PID = Process ID</li></ul><p><b>Örnek:</b> Tarayıcı bir süreç, her sekme bir thread</p>`},
{id:'android',cat:'İşletim Sistemi',keys:['android','android mimarisi'],title:'Android Mimarisi',body:`<p><b>Katmanlar:</b></p><ol><li><b>Linux Kernel:</b> Sürücüler, bellek, süreçler</li><li><b>HAL:</b> Donanım soyutlama</li><li><b>Native Kütüphaneler:</b> SQLite, OpenGL, WebKit</li><li><b>ART:</b> Java/Kotlin runtime</li><li><b>Framework:</b> Activity, Service, Broadcast</li><li><b>Uygulamalar</b></li></ol>`},
{id:'windows',cat:'İşletim Sistemi',keys:['windows','microsoft'],title:'Windows',body:`<p>Microsoft'un işletim sistemi. Masaüstünde en yaygın.</p><ul><li><b>NTFS:</b> Dosya sistemi</li><li><b>Registry:</b> Ayarlar veritabanı</li><li><b>CMD/PowerShell:</b> Komut satırı</li><li><b>UAC:</b> Yönetici izin kontrolü</li></ul>`},
{id:'macos',cat:'İşletim Sistemi',keys:['macos','mac','apple'],title:'macOS',body:`<p>Apple'ın masaüstü işletim sistemi. Unix tabanlı (BSD).</p><ul><li><b>APFS:</b> Dosya sistemi</li><li><b>Terminal:</b> bash/zsh</li><li><b>Homebrew:</b> Paket yöneticisi</li><li><b>Gatekeeper:</b> Uygulama doğrulama</li></ul><p>Sadece Apple donanımında resmi.</p>`},
{id:'dosya-sistemi',cat:'İşletim Sistemi',keys:['dosya sistemi','filesystem','ntfs','ext4'],title:'Dosya Sistemleri',body:`<p><b>NTFS:</b> Windows, büyük dosya, izinler</p><p><b>FAT32:</b> Her yerde, 4 GB limit</p><p><b>exFAT:</b> SD/USB, büyük dosya, geniş uyum</p><p><b>ext4:</b> Linux varsayılan</p><p><b>APFS:</b> macOS/iOS, şifreleme dostu</p>`},

/* ═══ LINUX ═══ */
{id:'linux',cat:'Linux',keys:['linux','gnu','unix'],title:'Linux Temelleri',body:`<p>Açık kaynaklı, çok kullanıcılı, çok görevli işletim sistemi çekirdeği. Linus Torvalds, 1991.</p><ul><li>Her şey bir <b>dosya</b>dır</li><li>Büyük/küçük harf duyarlı</li><li>Yetki: user, group, others</li><li>Paket yöneticisi: apt, pkg, dnf, pacman</li></ul><p><b>Dizin yapısı:</b> <code>/</code> kök, <code>/home</code> ev, <code>/etc</code> yapılandırma, <code>/bin</code> komutlar, <code>/tmp</code> geçici, <code>/var</code> log.</p>`},
{id:'termux',cat:'Linux',keys:['termux','termux nedir'],title:'Termux Nedir?',body:`<p>Android üzerinde çalışan <b>terminal + Linux paket ortamı</b>.</p><ul><li>Root gerekmez</li><li>Paket yöneticisi: <code>pkg</code></li><li>Python, Node.js, git, ssh, vim kurulabilir</li><li>F-Droid/GitHub'dan indirilir</li></ul><pre><code>pkg update
pkg upgrade
pkg install python git nano</code></pre>`},
{id:'pkg',cat:'Linux',keys:['pkg','apt','paket yönetimi'],title:'Paket Yönetimi',body:`<pre><code>pkg update           # depoyu güncelle
pkg upgrade          # paketleri güncelle
pkg install python   # kur
pkg uninstall python # kaldır
pkg search vim       # ara
pkg list-installed   # kurulu</code></pre><p><b>apt eşdeğeri:</b> <code>apt update</code>, <code>apt install</code>, <code>apt remove</code></p>`},
{id:'terminal',cat:'Linux',keys:['terminal','shell','bash','cli'],title:'Terminal ve Shell',body:`<p><b>Terminal:</b> Komut penceresi.</p><p><b>Shell:</b> Komutları yorumlayan program (bash, zsh, sh).</p><pre><code>pwd          # neredeyim
ls -la       # dosyaları listele
cd /home     # dizin değiştir
mkdir yeni   # dizin oluştur
touch a.txt  # dosya oluştur
cat a.txt    # içeriği göster</code></pre>`},
{id:'ls',cat:'Linux',keys:['ls','listeleme','dizin listele'],title:'ls — Dizin Listeleme',body:`<pre><code>ls           # basit
ls -l        # ayrıntılı
ls -a        # gizli dosyalar
ls -lah      # insan okunur boyut
ls -lt       # tarihe göre
ls *.py      # sadece .py</code></pre>`},
{id:'cd',cat:'Linux',keys:['cd','pwd','dizin değiştir'],title:'cd ve pwd',body:`<pre><code>pwd          # şu anki dizin
cd /home     # mutlak
cd belgeler   # göreceli
cd ..        # üst dizin
cd ~         # ev dizini
cd -         # önceki</code></pre>`},
{id:'mkdir-touch',cat:'Linux',keys:['mkdir','touch','dizin oluştur'],title:'mkdir ve touch',body:`<pre><code>mkdir proje              # dizin
mkdir -p a/b/c           # iç içe
touch not.txt            # boş dosya
touch a.txt b.txt        # çoklu</code></pre>`},
{id:'cp-mv-rm',cat:'Linux',keys:['cp','mv','rm','kopyala','sil'],title:'cp, mv, rm',body:`<pre><code>cp a.txt b.txt        # kopyala
cp -r klasor1 klasor2 # dizin

mv a.txt b.txt        # yeniden adlandır
mv a.txt /tmp/        # taşı

rm a.txt              # sil
rm -r klasor          # dizin
rm -rf klasor         # zorla (DİKKAT)</code></pre><p><b>UYARI:</b> <code>rm -rf /</code> sistemi mahveder.</p>`},
{id:'cat-less',cat:'Linux',keys:['cat','less','head','tail'],title:'cat, less, head, tail',body:`<pre><code>cat a.txt          # tümü
less a.txt         # sayfa sayfa (q: çık)
head a.txt         # ilk 10
head -n 5 a.txt    # ilk 5
tail a.txt         # son 10
tail -f log.txt    # canlı</code></pre>`},
{id:'grep-find',cat:'Linux',keys:['grep','find','arama'],title:'grep ve find',body:`<pre><code>grep "hata" log.txt         # metin
grep -i "hata" log.txt      # harf yoksay
grep -rn "TODO" .           # özyinelemeli

find . -name "*.py"         # dosya
find . -type d              # dizinler
find . -mtime -7            # son 7 gün</code></pre>`},
{id:'chmod',cat:'Linux',keys:['chmod','izin','permission','rwx'],title:'Dosya İzinleri',body:`<p><b>rwx:</b> oku(4), yaz(2), çalıştır(1)</p><p><b>u/g/o:</b> sahip, grup, diğerleri</p><pre><code>chmod +x script.sh        # çalıştırma izni
chmod 755 script.sh       # rwxr-xr-x
chmod 644 a.txt           # rw-r--r--
chmod 600 gizli.txt       # rw-------
chown user:user a.txt</code></pre><p><b>Sayı hesabı:</b> 7=rwx, 6=rw-, 5=r-x, 4=r--</p>`},
{id:'pipe',cat:'Linux',keys:['pipe','yönlendirme','redirect'],title:'Pipe ve Yönlendirme',body:`<pre><code>ls | grep ".py"              # pipe (boru)
echo "merhaba" > a.txt       # yaz (üzerine)
echo "satır" >> a.txt        # ekle (sonuna)
komut 2> hata.txt            # stderr
komut &> hepsi.txt           # her ikisi</code></pre>`},
{id:'ps-kill',cat:'Linux',keys:['ps','süreç','kill','top'],title:'Süreç Yönetimi',body:`<pre><code>ps -ef              # tüm süreçler
ps aux              # ayrıntılı
top                 # canlı izleme
htop                # görsel top
kill 1234           # kibar (SIGTERM)
kill -9 1234        # zorla (SIGKILL)
killall python</code></pre>`},
{id:'tar',cat:'Linux',keys:['tar','arşiv','zip','gzip'],title:'Arşivleme',body:`<pre><code>tar -cvf arsiv.tar dosya/       # oluştur
tar -xvf arsiv.tar              # aç
tar -czvf arsiv.tar.gz dosya/   # gzip ile
tar -xzvf arsiv.tar.gz

zip -r arsiv.zip dosya/
unzip arsiv.zip</code></pre>`},
{id:'ssh',cat:'Linux',keys:['ssh','uzak','scp','sftp'],title:'SSH Temelleri',body:`<pre><code>ssh-keygen -t ed25519 -C "ben@ornek.com"
ssh kullanici@sunucu
ssh -p 2222 user@host

scp dosya.txt user@host:/tmp/

# Termux SSH sunucusu:
pkg install openssh
sshd
whoami</code></pre>`},
{id:'nano-vim',cat:'Linux',keys:['nano','vim','editör'],title:'nano ve vim',body:`<p><b>nano (kolay):</b></p><pre><code>nano a.txt
# Ctrl+O kaydet, Ctrl+X çık</code></pre><p><b>vim (güçlü):</b></p><pre><code>vim a.txt
# i: yazma modu, Esc: komut
# :w kaydet, :q çık, :wq ikisi, :q! zorla</code></pre>`},
{id:'sudo',cat:'Linux',keys:['sudo','root','yetki'],title:'sudo ve Root',body:`<p><b>root:</b> En yetkili kullanıcı.</p><p><b>sudo:</b> Tek komuta root yetkisi.</p><pre><code>sudo apt update
sudo -i              # root kabuğu
sudo -u user komut</code></pre><p><b>Termux:</b> sudo yok, root'lu cihazlarda <code>tsu</code>.</p>`},
{id:'env',cat:'Linux',keys:['env','environment','path'],title:'Ortam Değişkenleri',body:`<pre><code>echo $PATH              # yol
export FOO="bar"        # tanımla
export PATH=$PATH:/yeni # ekle
env                     # tümü
unset FOO               # kaldır</code></pre><p><b>Kalıcı:</b> <code>~/.bashrc</code> içine yaz.</p>`},
{id:'cron',cat:'Linux',keys:['cron','zamanlanmış','crontab'],title:'Cron (Zamanlanmış Görev)',body:`<pre><code>crontab -e      # düzenle
crontab -l      # listele

# dakika saat gün ay hafta komut
0 3 * * *      /home/user/yedek.sh
*/5 * * * *    /home/user/kontrol.sh</code></pre>`},
{id:'disk-usage',cat:'Linux',keys:['df','du','disk'],title:'df ve du',body:`<pre><code>df -h              # disk doluluk
df -i              # inode
du -sh klasor      # dizin boyutu
du -h --max-depth=1 .
du -ah | sort -rh | head -10</code></pre>`},
{id:'network',cat:'Linux',keys:['ping','curl','wget','network'],title:'Ağ Komutları',body:`<pre><code>ping google.com
curl https://api.github.com
curl -O https://ornek.com/a.zip
wget https://ornek.com/a.zip
ifconfig         # IP
ip a             # modern
netstat -tuln    # açık portlar</code></pre>`},
{id:'bash-script',cat:'Linux',keys:['bash script','shell script'],title:'Bash Script',body:`<pre><code>#!/bin/bash
ISIM="Öznur"
echo "Merhaba $ISIM"

sayi=5
echo $((sayi * 2))

if [ $sayi -gt 3 ]; then
    echo "Büyük"
fi

for i in 1 2 3; do
    echo $i
done

selam() { echo "Selam $1"; }
selam "Ali"</code></pre>`},
{id:'alias',cat:'Linux',keys:['alias','kısayol','takma ad'],title:'alias',body:`<pre><code>alias ll='ls -lah'
alias gs='git status'

# Kalıcı için ~/.bashrc:
echo "alias ll='ls -lah'" >> ~/.bashrc
source ~/.bashrc</code></pre>`},
{id:'wsl',cat:'Linux',keys:['wsl','windows linux','subsystem'],title:'WSL',body:`<p>Windows içinde Linux çekirdeği çalıştırır.</p><pre><code>wsl --install
wsl --list --verbose
wsl -d Ubuntu</code></pre><p>WSL 2 gerçek Linux kernel içerir, Docker da çalışır.</p>`}
);

console.log('[KB-1] yüklendi: ' + OZ.KB.length + ' konu');
})();
