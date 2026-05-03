// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run `node scripts/generate-lessons.mjs` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
  {
    slug: `file-systems-ntfs-fat32-exfat`,
    title: `FILE SYSTEMS — NTFS / FAT32 / exFAT`,
    orderIndex: 1,
    durationMinutes: 12,
    isPreview: true,
    markdown: `## Sisteme de fișiere — cum își organizează discul un calculator

Un **sistem de fișiere** este modul prin care sistemul de operare împarte spațiul de pe un disc în fișiere și foldere și ține minte unde se află fiecare bit. Fără el, hard disk-ul ar fi un teanc uriaș de zerouri și unu fără sens. Alegerea sistemului de fișiere influențează compatibilitatea (ce dispozitive citesc stick-ul), dimensiunea maximă a unui fișier și ce funcții de securitate sunt disponibile.

### NTFS — standardul Windows modern

**NTFS** (New Technology File System) este sistemul folosit de Windows din 2001 încoace pentru partiția unde e instalat sistemul de operare. Suportă fișiere de până la 16 TB, partiții de 256 TB, păstrează permisiuni pe fiecare fișier (cine poate citi, cine poate scrie), criptare nativă prin EFS și jurnalizare (în caz de pană de curent, sistemul știe ce operații erau în desfășurare și poate reveni la o stare validă).

Limitarea principală: nu toate dispozitivele citesc NTFS. Un televizor mai vechi sau o cameră foto ieftină se vor uita la stick-ul tău și vor vedea „format necunoscut".

### FAT32 — bătrânul universal

**FAT32** (File Allocation Table, 32-bit) datează din 1996 și e citit absolut de orice — Windows, macOS, Linux, PlayStation, televizoare, mașini. Compromisul: limita de **4 GB pe fișier** și partiții de maximum aproximativ 2 TB (chiar dacă teoretic specificația permite mai mult, Windows refuză să formateze peste asta). Dacă încerci să copiezi un film de 5 GB pe un stick FAT32, Windows va refuza, indiferent câț spațiu liber există.

### exFAT — compromisul modern

**exFAT** (Extended File Allocation Table) a fost creat de Microsoft în 2006 special pentru memorii flash mari (carduri SD, stick-uri USB). Sparge limita de 4 GB (suportă fișiere de până la 16 EB — practic infinit), nu are jurnalizare grea ca NTFS (deci scrie/șterge mai puține date pe celulele flash, prelungind viața stick-ului) și e suportat nativ pe Windows, macOS și pe majoritatea dispozitivelor moderne.

### Tabel comparativ

| Caracteristică | NTFS | FAT32 | exFAT |
| --- | --- | --- | --- |
| Dimensiune max fișier | 16 TB | **4 GB** | 16 EB |
| Dimensiune max partiție | 256 TB | ~2 TB | 256 TB |
| Permisiuni / drepturi | Da | Nu | Nu |
| Criptare nativă (EFS) | Da | Nu | Nu |
| Compatibilitate | Windows | Universal | Dispozitive moderne |
| Recomandat pentru | Discul intern Windows | Stick-uri vechi, dispozitive simple | Carduri SD, stick-uri mari |

### Echivalente pe Linux și macOS

Linux folosește în mod tipic **ext4** pentru partițiile de sistem (jurnalizat, suportă fișiere uriașe, e standardul de zeci de ani), iar opțiunile mai noi sunt **Btrfs** (cu snapshot-uri instantanee) și **XFS** (folosit pe servere). macOS a trecut de la **HFS+** la **APFS** odată cu macOS High Sierra, iar APFS a fost proiectat pentru SSD-uri și suportă clonare instantanee a fișierelor și criptare la nivel de container.

Dacă ai un disc extern pe care vrei să-l folosești și pe Mac și pe Windows, **exFAT** rămâne cel mai sigur compromis — ambele sisteme citesc și scriu fără drivere suplimentare.

### Comenzi utile

Pe Windows, în PowerShell sau CMD, formatezi explicit cu:

\`\`\`powershell
format E: /FS:exFAT /Q
\`\`\`

Pe Linux, ca să vezi ce sistem de fișiere are un dispozitiv:

\`\`\`bash
lsblk -f
sudo file -s /dev/sdb1
\`\`\`

### Tendințe în 2026

Sistemele de fișiere copy-on-write (Btrfs, ZFS, APFS) câștigă teren pentru că oferă snapshot-uri „gratuite" și verificare integrității datelor împotriva coruperii silențioase. Microsoft promovează **ReFS** (Resilient File System) pe Windows Server, dar pe desktop NTFS rămâne încă regele.`,
  },
  {
    slug: `backup-restore`,
    title: `BACKUP & RESTORE`,
    orderIndex: 2,
    durationMinutes: 12,
    isPreview: true,
    markdown: `## Backup și restaurare — cum nu îți pierzi datele

Există două categorii de oameni: cei care fac backup și cei care vor face. Diferența e momentul în care îți moare SSD-ul cu licența ta de an, fotografiile de la nuntă sau proiectul la care ai lucrat trei luni.

### Regula 3-2-1

Profesioniștii din IT recomandă: **3** copii ale datelor importante, pe **2** tipuri diferite de medii (de exemplu SSD intern + disc extern), cu **1** copie păstrată în altă locație fizică (la rude, la birou, sau în cloud). Astfel, un incendiu, o inundație sau un ransomware nu îți distrug toate copiile simultan.

### Instrumentele Windows

**File History** este soluția modernă din Windows 10/11 pentru backup automat al fișierelor personale. O activezi din _Settings rezultă Update & Security rezultă Backup_, alegi un disc extern sau o locație de rețea, iar Windows copiază periodic versiuni ale fișierelor din Documents, Pictures, Desktop și OneDrive. Avantajul cheie: păstrează **versiuni anterioare** — dacă suprascrii din greșeală un fișier Word, poți reveni la cum arăta acum trei zile.

**Disk Cleanup** (sau noul **Storage Sense**) eliberează spațiu ștergând fișiere temporare, cache de update-uri și folderul \`Windows.old\` rămas după un upgrade major. După un upgrade de la Windows 10 la 11, recuperezi adesea 20-30 GB curățând acest folder.

**System Restore** creează puncte de restaurare ale **setărilor sistemului, driverelor și aplicațiilor** — nu atinge documentele tale. E util când un driver nou cauzează ecran albastru: deschizi _Recovery_, alegi un punct de dinainte de instalare, iar sistemul revine la acea configurație păstrând fișierele personale intacte.

### Reset PC — cele două variante

Când Windows e iremediabil corupt, ultima soluție înainte de reinstalare manuală este _Reset this PC_:

- **Keep my files** — reinstalează Windows curat, păstrează fișierele tale personale, dar șterge toate aplicațiile.
- **Remove everything** — formatează totul; folosit înainte de a vinde sau dona calculatorul.

### Backup în cloud

**OneDrive** e integrat nativ în Windows și sincronizează Documents, Pictures și Desktop dacă pornești _Folder Backup_. Pentru un cont Microsoft 365 personal primești 1 TB de spațiu inclus.

Alternativele sunt numeroase: **Google Drive** (15 GB gratuit), **iCloud Drive** (5 GB gratuit, mai mult cu abonament), **Dropbox**, **Backblaze B2** (un serviciu specializat de backup care costă aproximativ 7 dolari/lună pentru spațiu nelimitat de pe un PC).

### Echivalent pe Linux și macOS

**macOS** are **Time Machine**, probabil cel mai rafinat sistem de backup pentru utilizatori obișnuiți: îl conectezi la un disc extern, îl pornești o dată, iar de atunci backup-ul e automat și navigabil grafic în timp.

**Linux** oferă mai multe opțiuni:

\`\`\`bash
# Copie completă a unui folder, păstrând permisiunile
rsync -av --progress /home/cristina/ /mnt/backup/

# Snapshot incremental cu Timeshift (interfață grafică)
sudo timeshift --create --comments "inainte de upgrade"
\`\`\`

Comanda \`rsync\` e standardul de aur pe Unix: copiază doar diferențele între rulări, deci după primul backup complet, următoarele durează secunde.

### Securitate fizică a backup-ului

Un backup nesecurizat este o problemă, nu o soluție. Dacă cineva îți fură discul extern, are toate datele. Cripteaza:

- pe Windows, **BitLocker To Go** pe stick-ul de backup;
- pe macOS, FileVault pe discul Time Machine;
- pe Linux, **LUKS** prin _Disks_ sau \`cryptsetup\`.

### Tendințe în 2026

Backup-urile imutabile (immutable backups) devin standardul: copia salvată nu poate fi modificată sau ștearsă pentru un interval definit, ceea ce blochează atacurile ransomware care încearcă să cripteze și backup-urile odată cu sistemul. Servicii precum AWS S3 cu Object Lock sau Backblaze B2 cu Object Lock implementează această protecție.`,
  },
  {
    slug: `windows-registry`,
    title: `WINDOWS REGISTRY`,
    orderIndex: 3,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Windows Registry — baza de date a sistemului

**Registry** este o bază de date ierarhică în care Windows își păstrează aproape toată configurația: profilurile utilizatorilor, setările aplicațiilor, asocierile fișier-aplicație (.docx se deschide cu Word), parametrii driverelor, cheile produs, ce programe pornesc la startup.

E un fel de „creier" al sistemului. Cu o cheie greșită ștearsă, Windows poate refuza să mai pornească.

### Structura — cele cinci ramuri principale

Registry e împărțit în cinci „hive-uri" (HKEYs):

- **HKEY_CLASSES_ROOT (HKCR)** — asocieri tip de fișier rezultă aplicație.
- **HKEY_CURRENT_USER (HKCU)** — setările utilizatorului logat în acest moment.
- **HKEY_LOCAL_MACHINE (HKLM)** — setările întregului calculator (toate conturile).
- **HKEY_USERS (HKU)** — setările tuturor utilizatorilor de pe acest PC.
- **HKEY_CURRENT_CONFIG (HKCC)** — profilul hardware activ.

Cheile cele mai des modificate sunt în **HKCU\\Software** (setări per-utilizator) și **HKLM\\Software** (setări per-mașină).

### Cum îl deschizi

Tastezi \`regedit\` în meniul Start și confirmi UAC. Editorul arată ca un Explorer cu chei (foldere) și valori (perechi nume-valoare).

### Persistență

Registry e stocat fizic pe disc, în fișiere de sistem din \`C:\\Windows\\System32\\Config\\\`. Asta înseamnă că **modificările supraviețuiesc restartului** — spre deosebire de ce e doar în RAM. Tot din acest motiv, **OneDrive nu face backup la Registry**: e un fișier de sistem, nu un document personal.

### Cine îl modifică

Aproape orice instalator scrie în Registry — atât cele oficiale Microsoft, cât și aplicațiile terțe. Când instalezi Photoshop sau VLC, kit-ul lor adaugă chei sub \`HKLM\\Software\` cu calea de instalare, versiunea, asocierile de fișier. Așa funcționează _Open with..._.

Implicația practică: **a șterge folderul aplicației din Program Files NU dezinstalează aplicația**. Cheile rămân în Registry, scurtăturile rămân în meniul Start, iar uneori task-uri programate continuă să încerce să ruleze. Folosește mereu uninstaller-ul oficial sau _Settings rezultă Apps rezultă Installed Apps_.

În același sens, **a șterge un shortcut de pe Desktop nu dezinstalează nimic** — scurtătura e doar un fișier .lnk care arată spre executabilul real.

### Backup la Registry

Înainte să modifici ceva în Registry, exportă cheia:

\`\`\`text
File rezultă Export rezultă alegi locația rezultă salvezi ca .reg
\`\`\`

Dacă strici ceva, dublu-click pe fișierul .reg readuce valorile inițiale.

### Echivalent pe Linux și macOS

Linux **nu are un Registry centralizat**. Configurația e răspândită în fișiere text:

- Setări per-utilizator în \`~/.config/\`, \`~/.bashrc\`, \`~/.profile\`.
- Setări de sistem în \`/etc/\` (de exemplu \`/etc/ssh/sshd_config\`, \`/etc/fstab\`).

Filosofia e „totul e fișier text", deci poți copia, edita cu orice editor, urmări în git. Comenzi tipice:

\`\`\`bash
cat ~/.bashrc
sudo nano /etc/hosts
\`\`\`

macOS folosește **fișiere \`.plist\`** (property list, format XML sau binar) în \`~/Library/Preferences/\` și \`/Library/Preferences/\`. Le citești cu \`defaults read\` și le modifici cu \`defaults write\`.

### Tendințe în 2026

Microsoft împinge tot mai mult configurația aplicațiilor moderne (din Microsoft Store, MSIX) într-un model de virtualizare a Registry-ului — modificările unei aplicații nu mai poluează Registry-ul global, ci sunt izolate. E începutul tranziției spre o configurație mai curată și mai apropiată de modelul macOS.`,
  },
  {
    slug: `accounts-uac`,
    title: `ACCOUNTS & UAC`,
    orderIndex: 4,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Conturi de utilizator și UAC — cine poate face ce

Windows separă acțiunile în funcție de privilegiile contului. Asta nu e birocrație: e prima linie de apărare împotriva malware-ului care încearcă să modifice sistemul fără consimțământul tău.

### Tipuri de conturi

**Administrator** — control total: instalează software, modifică fișiere de sistem, schimbă setările tuturor utilizatorilor, accesează Registry. Pe Windows 10/11 Home, contul cu care instalezi prima dată e implicit Administrator.

**Standard User** — poate folosi calculatorul, instala aplicații în propriul profil, dar nu poate atinge fișiere de sistem sau registru fără să ridice privilegiile. E configurația sigură pentru copii sau pentru un PC partajat.

**Microsoft Account** — un cont online (cu adresă email Microsoft, Outlook, Hotmail) care sincronizează setări, parole, OneDrive, licențe și aplicații din Microsoft Store între mai multe dispozitive. Dacă Mihai are același cont pe laptop și pe PC-ul de acasă, fundalul, parolele Edge și aplicațiile cumpărate apar pe ambele.

**Local Account** — cont care există doar pe acel calculator, fără sincronizare. Se folosește pentru intimitate sau pentru calculatoare care nu se conectează niciodată la internet.

### UAC — User Account Control

**UAC** e dialogul „Do you want to allow this app to make changes to your device?" care apare când lansezi un instalator sau un program care cere drepturi de administrator. Apare indiferent dacă ești pe un cont Administrator sau Standard, dar consecințele diferă:

- pe **Administrator**, doar confirmi cu Yes;
- pe **Standard User**, ți se cere parola unui cont Administrator pentru a continua.

UAC nu e antivirus. Nu detectează malware. Doar te previne că o aplicație vrea să modifice ceva important și îți dă șansa să refuzi. Combinația UAC + cont Standard pentru utilizarea zilnică este o practică de securitate solidă, recomandată de NSA și de ghidurile de hardening.

### Folderele Program Files

Windows pe 64 de biți are două foldere:

- \`C:\\Program Files\\\` — pentru aplicațiile **64-bit**.
- \`C:\\Program Files (x86)\\\` — pentru aplicațiile **32-bit** (vechi, x86 = arhitectura 32-bit Intel).

Atenție: **x86 înseamnă 32-bit, nu 86-bit**. Numele vine de la familia procesoarelor Intel 8086, 80286, 80386, 80486 — toate pe 16 sau 32 de biți. Aplicațiile pe 64-bit merg în folderul \`Program Files\` simplu.

Când instalezi software ca Standard User în \`Program Files\`, UAC va apărea pentru că folderul e protejat. Dacă instalezi în propriul profil (\`%LOCALAPPDATA%\`), nu cere parolă — și de aceea unele aplicații (Spotify, Slack, multe extensii Chrome) se instalează implicit acolo.

### Dezinstalare corectă

A șterge folderul aplicației din Program Files lasă reziduuri în Registry, fișiere de configurare în \`%APPDATA%\`, scurtături în meniul Start și uneori servicii Windows. **Folosește uninstaller-ul oficial** sau _Settings rezultă Apps rezultă Installed Apps rezultă Uninstall_.

### Echivalent pe Linux și macOS

Linux are filosofia **least privilege** chiar mai strictă: contul tău normal nu poate atinge nimic din \`/usr/\`, \`/etc/\` sau \`/var/\`. Pentru modificări de sistem folosești \`sudo\`:

\`\`\`bash
sudo apt install firefox
sudo systemctl restart nginx
\`\`\`

\`sudo\` cere parola contului tău (dacă ești în grupul \`sudoers\`) și e echivalentul UAC + ridicare privilegii într-o singură comandă.

macOS folosește un model similar: utilizatorul „admin" e tot un cont normal, iar pentru acțiuni de sistem apare prompt-ul de parolă (echivalentul macOS al UAC).

### Tendințe în 2026

**Passwordless login** — Windows Hello, FIDO2, passkeys — înlocuiesc treptat parola la conturile Microsoft. Logarea cu chip biometric sau cheie hardware (YubiKey) este mai sigură și mai rapidă. Microsoft permite deja conturi fără parolă deloc — singura modalitate de autentificare e Hello sau Authenticator.`,
  },
  {
    slug: `authenticator-windows-hello`,
    title: `AUTHENTICATOR & WINDOWS HELLO`,
    orderIndex: 5,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Authenticator și Windows Hello — autentificare modernă

Parola singură nu mai e suficientă. Cu o bază de date scursă de pe un site oarecare, atacatorii încearcă combinațiile email + parolă pe alte servicii (credential stuffing). Soluția: **autentificare multifactor (MFA)** — chiar dacă cineva îți știe parola, nu intră fără al doilea factor.

### Cei trei factori

- **Ceva ce știi** — parola, PIN-ul.
- **Ceva ce ai** — telefonul cu aplicație Authenticator, o cheie YubiKey, un card cu cip.
- **Ceva ce ești** — amprenta, fața, irisul (biometrie).

MFA înseamnă combinarea a cel puțin doi factori diferiți. Doi parole diferite nu sunt MFA — e tot „ceva ce știi".

### Microsoft Authenticator

E o aplicație gratuită de pe telefon (iOS și Android) care îndeplinește două roluri:

1. **Generator TOTP** — produce coduri de șase cifre care se schimbă la fiecare 30 de secunde, sincronizate cu serverul. Funcționează și **fără internet** odată configurat, pentru că algoritmul (RFC 6238) e bazat pe ceasul telefonului plus o cheie partajată inițial. Folosit la o gamă largă de servicii — GitHub, Google, conturi bancare, etc.

2. **Push notifications pentru conturi Microsoft / Azure AD** — când te loghezi pe un cont Microsoft sau de muncă, în loc de cod, apare o notificare pe telefon: „Approve sign-in?" cu un număr de confirmat. Funcționează doar pentru conturi Microsoft și Azure AD, **nu pentru conturi locale Windows**.

Authenticator este al **doilea** factor — îl introduci după parolă, nu în locul ei. Dacă uiți parola, Authenticator nu te lasă să intri; trebuie să recuperezi parola prin email sau alte metode.

### Alternative la Authenticator

- **Google Authenticator** — același principiu TOTP.
- **Authy** — sincronizează coduri între dispozitive.
- **1Password / Bitwarden** — manageri de parole care includ și TOTP.
- **Chei hardware (YubiKey, Nitrokey)** — cea mai sigură formă, rezistentă la phishing.

### Windows Hello

**Windows Hello** este sistemul biometric integrat în Windows 10/11. Trei moduri:

- **Hello Face** — recunoaștere facială prin **cameră IR** (infraroșu), nu o cameră web obișnuită. Camera IR vede în 3D și nu poate fi păcălită cu o fotografie. Apar mesaje precum „Looking for you..." și logarea durează sub o secundă.
- **Hello Fingerprint** — cititor de amprentă (pe laptop, pe tastatură, pe buton de power).
- **Hello PIN** — un PIN local, legat de TPM-ul calculatorului. Diferit de parola contului Microsoft pentru că e valabil doar pe acest device.

### Mituri despre Windows Hello

- **„Trebuie cont Microsoft pentru recunoaștere facială."** Fals. Hello funcționează și cu un cont local Windows. Datele biometrice rămân pe calculator, nu se trimit la Microsoft.
- **„Dacă fața nu e recunoscută, te logă automat cu parola."** Fals. Trebuie să introduci manual PIN-ul sau parola.
- **„Hello înlocuiește parola."** Parțial — Hello e o metodă alternativă de logare, dar contul tot are o parolă în spate.

### Echivalent pe Linux și macOS

**macOS** are **Touch ID** (cititor de amprentă pe MacBook și pe tastaturile externe Apple) și **Face ID** doar pe iPhone/iPad — nu și pe Mac.

**Linux** are suport biometric prin **fprintd** (fingerprint daemon) și \`pam_fprintd\`. Pe Ubuntu, configurarea durează un minut:

\`\`\`bash
sudo apt install fprintd libpam-fprintd
sudo fprintd-enroll
\`\`\`

Apoi sudo și unlock recunosc amprenta.

### Manageri de parole

Indiferent de MFA, **un manager de parole e obligatoriu** în 2026. **Bitwarden** (gratuit, open source), **1Password** (cel mai polizat, cu plată), **KeePassXC** (offline, gratuit) generează și păstrează parole unice de 20+ caractere pentru fiecare site, criptate cu o singură parolă-master.

### Tendințe în 2026

**Passkeys** — standardul FIDO2 — promit să elimine parola complet. În loc de parolă, contul tău are o cheie criptografică stocată pe telefon sau pe o cheie hardware. Apple, Google și Microsoft suportă deja passkeys, iar siteurile mari (PayPal, Amazon, GitHub) le adoptă rapid. Phishing-ul tradițional devine imposibil cu passkeys.`,
  },
  {
    slug: `hardware-ram-gpu-motherboard`,
    title: `HARDWARE — RAM, GPU, MOTHERBOARD`,
    orderIndex: 6,
    durationMinutes: 14,
    isPreview: false,
    markdown: `## Componentele de bază — RAM, GPU, placă de bază

Un calculator e un ansamblu de piese cu roluri specifice. Înțelegerea fiecăreia te ajută atunci când îți alegi un PC nou, când diagnostichezi o problemă sau când planifici un upgrade.

### Memoria RAM

**RAM** (Random Access Memory) e memoria de lucru — un spațiu ultrarapid în care procesorul ține datele cu care lucrează acum. Datele sunt **volatile**: dispar imediat ce calculatorul se oprește. Spre deosebire, SSD-ul și HDD-ul sunt **non-volatile** și păstrează datele și după oprire.

Când deschizi Chrome, executabilul Chrome și paginile web se copiază de pe SSD în RAM, pentru că procesorul citește din RAM de zeci de mii de ori mai rapid decât de pe SSD. La restart, RAM-ul se golește complet — de aceea „ai încercat să-l închizi și să-l deschizi?" rezolvă atâtea probleme.

**Generațiile actuale**:

- **DDR4** — frecvențe între 2400 și 3600 MHz, încă predominant pe sisteme mid-range.
- **DDR5** — succesorul lansat în 2021, pleacă de la 4800 MHz și ajunge peste 7200 MHz pe overclock. Lățimea de bandă mai mare, eficiență energetică mai bună.
- **LPDDR5** — variantă cu consum redus pentru laptopuri ușoare și telefoane.

**Cât ai nevoie?** Pentru Windows 11 cu navigare și office, 8 GB e minimul rezonabil. Pentru programare, gaming modern, editare foto, 16 GB e bun. Pentru editare video 4K sau machine learning, 32 GB+ devine necesar.

### Stocarea fizică — SSD, HDD, flash

**Stocarea fizică** include SSD-urile, HDD-urile și stick-urile USB / cardurile SD. Toate sunt non-volatile.

- **HDD** (Hard Disk Drive) — discuri rotative cu cap de citire mecanic. Ieftin pe gigabyte, dar lent (50-150 MB/s) și fragil la șocuri.
- **SSD SATA** — celule flash, fără părți mobile. Viteze de 500 MB/s, fiabil.
- **SSD NVMe (M.2)** — conectat direct la magistrala PCIe, atinge 3000-7000 MB/s. Standardul actual pentru sisteme noi.

**SSD-ul e mereu mai rapid decât un HDD**, indiferent de „latency" sau alte specificații. Diferența e de ordin de mărime, nu procentuală.

### GPU — placa video

**GPU** (Graphics Processing Unit) procesează totul ce se vede pe ecran. Două tipuri:

- **GPU integrat** (în CPU) — Intel UHD, Intel Iris, AMD Radeon Vega. **Nu are memorie proprie** — împrumută din RAM-ul sistemului. Suficient pentru navigare, video și jocuri ușoare.
- **GPU dedicat** (placă separată) — NVIDIA GeForce, AMD Radeon. Are propriul **VRAM** (memorie video, GDDR6 sau GDDR6X). Necesar pentru gaming serios, editare video, AI.

Ieșirile video standard: **VGA** (analog, doar imagine, învechit), **DVI** (digital, doar imagine, învechit), **HDMI** (imagine + sunet, universal), **DisplayPort** (imagine + sunet, performanță superioară pe monitoare).

GPU-ul **nu poate accesa periferice** (mouse, tastatură, USB) ca să ajute CPU-ul. Periferiile rămân responsabilitatea CPU + chipset. GPU-ul are un singur job: matematică pe matrice și pixeli.

### Placa de bază — motherboard

**Motherboard-ul** e platforma fizică pe care se conectează toate celelalte componente. Determină:

- **Tipul de CPU** suportat (prin **socket** — LGA 1700 pentru Intel 12-14, AM5 pentru AMD Ryzen 7000/9000). Nu poți pune un AMD într-o placă Intel sau invers — sockete diferite.
- **Câtă RAM maximă** suportă (limită impusă de chipset și BIOS, tipic 64-192 GB pe consumer).
- **Câte sloturi PCIe**, **câți M.2** (NVMe), câte porturi SATA, USB, etc.

**BIOS / UEFI** — firmware-ul de pornire — e stocat pe un cip de pe placa de bază, alimentat de o **baterie CMOS** (CR2032) când calculatorul e oprit, ca să nu uite ora și setările.

### Echivalent pe Linux și macOS

Pe Linux verifici hardware-ul rapid din terminal:

\`\`\`bash
free -h                 # RAM total + folosit
lscpu                   # info CPU
lspci | grep -i vga     # GPU
sudo dmidecode -t memory # detalii pe slot RAM
\`\`\`

macOS deschide _About This Mac rezultă System Report_. Limitarea: pe Mac modern (Apple Silicon M1/M2/M3/M4), **RAM-ul e unificat** cu CPU și GPU pe același cip. **Nu poți face upgrade** — alegi capacitatea corectă din prima la cumpărare.

### Tendințe în 2026

- **ARM ataca x86** — Apple Silicon, chip-uri Snapdragon X pentru Windows, eficiență energetică superioară.
- **RISC-V** — arhitectură open-source care apare în plăci de dezvoltare și în primele laptopuri experimentale.
- **DDR5 devine standard**, DDR4 rămâne pe upgrade-uri economice.
- **PCIe 5.0** și începuturile **PCIe 6.0** dublează lățimea de bandă pentru SSD-uri NVMe și GPU-uri.`,
  },
  {
    slug: `conectori-porturi`,
    title: `CONECTORI & PORTURI`,
    orderIndex: 7,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Conectori și porturi — ghidul cablurilor

Cablurile arată similar dar nu sunt interschimbabile. Un VGA nu transportă sunet, un USB-A vechi nu încarcă un laptop modern, iar un DisplayPort nu se potrivește la o consolă PlayStation. Vedem fiecare port și pentru ce e bun.

### USB — universal, dar complicat

**USB** (Universal Serial Bus) a apărut în 1996 și a evoluat în multe versiuni:

- **USB 2.0** — 480 Mbps, conector tipic dreptunghiular USB-A negru.
- **USB 3.x** — 5 până la 20 Gbps, conector USB-A albastru sau roșu (intern).
- **USB-C** — conector mic, simetric, **reversibil**. Suportă **date + alimentare + video** prin același cablu.
- **Thunderbolt 3 / 4 / 5** — folosesc fizic conectorul USB-C, dar cu protocol Intel mai rapid (până la 80 Gbps pe TB5).

**USB Power Delivery (PD)** — standardul de încărcare pe USB-C — livrează până la **240 W** prin cablurile noi (PD 3.1). De aceea un singur cablu USB-C poate alimenta un MacBook Pro 16", o stație de andocare cu trei monitoare și un telefon, simultan.

### Conectori video

| Port | Audio | Video | Folosit pentru |
| --- | --- | --- | --- |
| **VGA** | Nu | Da, analog | Monitoare vechi, proiectoare în săli de clasă |
| **DVI** | Nu | Da, digital | Monitoare anii 2005-2015 |
| **HDMI** | Da | Da | TV, monitoare, console, laptopuri |
| **mini-HDMI** | Da | Da | Tablete, camere foto, drone |
| **DisplayPort** | Da | Da | Monitoare PC de înaltă performanță, NU console |
| **USB-C / TB** | Da | Da (DP Alt Mode) | Laptopuri moderne, monitoare 2020+ |

**De reținut**:

- **VGA** transportă DOAR imagine analogică, **fără sunet**. Dacă proiectorul are doar VGA, sunetul îl iei separat prin jack 3.5 mm.
- **HDMI** e universal pe TV, console (PlayStation, Xbox), proiectoare moderne.
- **DisplayPort** e preferat pe monitoare de gaming (suportă 4K@240Hz, G-Sync, FreeSync), dar **nu îl găsești pe console** sau pe TV-uri obișnuite.
- **USB-C cu DP Alt Mode** îți permite să conectezi un monitor 4K direct din portul de date al laptopului — un singur cablu pentru tot.

### Conectori audio

- **Jack 3.5 mm TRS** — analog, mufa clasică pentru căști.
- **Jack 3.5 mm TRRS** — patru conductori, suportă căști + microfon.
- **S/PDIF Optical (Toslink)** — fibră optică, **doar audio digital**, până la 5.1 surround.
- **HDMI ARC / eARC** — audio prin HDMI între TV și sound bar, în ambele sensuri.
- **Bluetooth** — wireless, nu cablu, dar merită menționat.

### Conectori de rețea și legacy

- **RJ45** — Ethernet, mufa clasică pentru cablu de rețea.
- **RJ11** — telefon analog, mai mică decât RJ45.
- **PS/2** — rotund, mov pentru tastatură, verde pentru mouse, dispărut din 2015.
- **Serial (DB9)** și **Parallel (DB25)** — învechite, dar încă pe echipamente industriale, casierie, dispozitive medicale.

### Echivalent pe Linux și macOS

Cablurile sunt fizice — funcționează identic pe orice sistem. Diferă softul de gestionare:

- pe Linux, \`xrandr\` sau \`wlr-randr\` (Wayland) controlează monitoarele;
- pe macOS, monitoare externe se configurează din _System Settings rezultă Displays_;
- USB-ul se enumeră cu \`lsusb\` pe Linux, \`system_profiler SPUSBDataType\` pe macOS.

### Tendințe în 2026

- **USB-C devine universal** — UE a impus USB-C pe toate telefoanele și laptopurile vândute, inclusiv pe iPhone (15 Pro și mai noi).
- **Thunderbolt 5** ajunge la 80 Gbps și 240W, suficient pentru două monitoare 8K.
- **HDMI 2.1** susține 4K@120Hz și 8K@60Hz, devine standard pe TV-uri premium.
- **Conectorii „proprietari"** (Lightning, MagSafe) dispar treptat în favoarea standardelor deschise.`,
  },
  {
    slug: `network-troubleshooting`,
    title: `NETWORK & TROUBLESHOOTING`,
    orderIndex: 8,
    durationMinutes: 14,
    isPreview: false,
    markdown: `## Rețele și depanare — diagnosticare pas cu pas

Când „nu merge internetul", problema poate fi în zece locuri diferite. Un IT-ist bun nu ghicește, ci verifică sistematic, de la cel mai apropiat strat la cel mai îndepărtat.

### IP, DHCP, gateway

Fiecare dispozitiv din rețea are o **adresă IP** — un identificator numeric. **Default gateway-ul** e adresa router-ului — calea spre exteriorul rețelei. **DHCP** (Dynamic Host Configuration Protocol) e serviciul care îți dă o IP automat când conectezi laptopul la WiFi, plus DNS, plus gateway.

Pe Windows, comanda principală e \`ipconfig\` (în Command Prompt sau PowerShell):

\`\`\`powershell
ipconfig                # adrese IP, gateway, DNS
ipconfig /all           # detalii complete inclusiv MAC
ipconfig /release       # eliberează adresa DHCP
ipconfig /renew         # cere o adresă nouă
ipconfig /flushdns      # golește cache-ul DNS
\`\`\`

### Adrese speciale

- **127.0.0.1** — loopback, calculatorul tău însuși.
- **192.168.x.x, 10.x.x.x, 172.16-31.x.x** — adrese private, folosite în rețele locale.
- **169.254.x.x** — **APIPA** (Automatic Private IP Addressing). Apare când DHCP nu răspunde. **Înseamnă că nu ai obținut IP de la router și nu vei avea internet.** Verifici cablul, restartezi router-ul, verifici dacă DHCP-ul e activ.

### Diagnostic în trei comenzi

\`\`\`powershell
ping 8.8.8.8            # ai conexiune la internet?
ping google.com         # rezolvi DNS?
tracert google.com      # pe unde trece pachetul?
\`\`\`

- \`ping\` trimite pachete ICMP și măsoară timpul de răspuns. Dacă \`ping 8.8.8.8\` merge, dar \`ping google.com\` nu, problema e DNS, nu conexiunea.
- \`tracert\` (sau \`traceroute\` pe Linux/macOS) îți arată fiecare router prin care trece pachetul tău spre destinație. Util ca să vezi unde se blochează — la tine, la ISP, sau mai departe.

### Comenzi suplimentare utile

\`\`\`powershell
nslookup github.com     # ce IP rezolvă pentru un nume DNS
netstat -ano            # ce conexiuni active sunt deschise
Get-NetAdapter          # plăci de rețea (PowerShell)
\`\`\`

### Probleme tipice și rezolvări

- **SSID-ul e vizibil dar nimeni nu se conectează.** Restartezi router-ul / access point-ul. Cele mai multe „bug-uri" se rezolvă cu un restart de 30 de secunde.
- **Politicile de grup nu se aplică pe un PC din domeniu.** Rulezi \`gpupdate /force\` ca administrator. \`gpresult /r\` doar arată ce politici sunt aplicate, nu le schimbă.
- **Smartphone-ul nu e recunoscut la USB.** Deschizi **Device Manager**, cauți dispozitivul cu semn de exclamare, click-dreapta rezultă _Update driver_ sau _Uninstall_ și reconectezi.
- **Aplicații din Microsoft Store nu se instalează.** Rulezi \`WSReset.exe\` în meniul Start — golește cache-ul Store-ului și deseori rezolvă instant.
- **Imprimantă veche cu adapter USB-to-serial.** În Device Manager, secțiunea **Ports (COM & LPT)** afișează portul COM virtual și parametrii (baud rate, paritate).
- **Imprimanta apare duplicat sau lipsește din folderul Printers.** În Device Manager, _View rezultă Show hidden devices_ scoate la iveală driverele „fantomă" rămase după dezinstalări incomplete.

### TCP vs UDP

Rețelele transportă pachete pe două protocoale principale:

- **TCP** (Transmission Control Protocol) — garantează livrarea, în ordine, retransmite ce s-a pierdut. Folosit de HTTP, HTTPS, SSH, email — orice trebuie să ajungă corect.
- **UDP** (User Datagram Protocol) — trimite și „uită". Mai rapid, fără retransmitere. Folosit de DNS, video în timp real, jocuri online, VoIP — unde un pachet pierdut nu merită așteptat.

### curl — testarea unui server web din linia de comandă

\`\`\`powershell
curl -I https://example.com         # doar headerele HTTP
curl -v https://example.com         # detaliat: handshake, headers, body
curl -X POST -d "data=1" https://api.example.com
\`\`\`

\`curl\` e disponibil nativ pe Windows 10/11, Linux, macOS. E instrumentul standard pentru a verifica dacă un API răspunde, pentru a testa HTTPS, pentru a depana cookie-uri.

### Echivalent pe Linux și macOS

\`\`\`bash
ip a                    # echivalentul ipconfig
ip route                # tabela de routing
ping -c 4 8.8.8.8       # 4 pachete și gata
traceroute google.com
dig github.com          # DNS detaliat (mai bun decât nslookup)
ss -tulpen              # porturi deschise (în loc de netstat)
\`\`\`

### Tendințe în 2026

- **IPv6** câștigă teren — adresele de tip \`2001:db8::1\` înlocuiesc treptat IPv4-ul epuizat.
- **DNS-over-HTTPS (DoH)** și **DNS-over-TLS (DoT)** criptează cererile DNS, ascunzându-le de ISP.
- **WiFi 7** (802.11be) ajunge în routere consumer cu viteze peste 30 Gbps în condiții ideale.`,
  },
  {
    slug: `firewall-network-profiles`,
    title: `FIREWALL & NETWORK PROFILES`,
    orderIndex: 9,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Firewall și profilurile de rețea — limita dintre tine și restul lumii

Un **firewall** e un filtru între calculatorul tău și rețea. Decide ce conexiuni intră, ce conexiuni ies, după reguli pe portuari, IP-uri, aplicații și protocoale. Fără el, orice serviciu pornit pe calculatorul tău (sharing de fișiere, server local, telecomandă) e accesibil oricui din rețea.

### Firewall ≠ Antivirus

E o confuzie comună:

- **Firewall** = controlează **conexiuni de rețea**. Blochează un atacator care încearcă să se conecteze la portul 445 al PC-ului tău.
- **Antivirus** = scanează **fișiere și procese** pe disc și în memorie. Detectează un troian descărcat dintr-un email.

Ai nevoie de ambele. Windows include nativ Microsoft Defender Firewall + Microsoft Defender Antivirus; ambele vin pornite implicit din Windows 10 încoace.

### Profiluri de rețea Windows

Când conectezi laptopul la o rețea nouă, Windows întreabă „Do you want to allow your PC to be discoverable by other PCs and devices on this network?". În spate alege un **profil de rețea**:

- **Public** — cafenea, aeroport, hotel, McDonald's. Restrictiv: PC-ul e ascuns, sharing-ul de fișiere e oprit, descoperire de rețea oprită. **Răspunsul corect pentru orice WiFi public.**
- **Private** — acasă, biroul mic. Permisiv: sharing pornit, PC vizibil, imprimante din rețea descoperite.
- **Domain** — folosit doar pe PC-uri legate la un domeniu Active Directory (companii). Configurat de IT-ul firmei prin Group Policy.

Schimbi profilul din _Settings rezultă Network & Internet rezultă click pe rețea rezultă Network profile type_.

### Reguli de firewall

Pe Windows deschizi **Windows Defender Firewall with Advanced Security** (\`wf.msc\`). Vezi:

- **Inbound Rules** — ce conexiuni intră sunt permise.
- **Outbound Rules** — ce conexiuni ies sunt permise.
- **Connection Security Rules** — IPsec, autentificare la nivel de pachet.

Regulile pot fi pe **port** (de exemplu 80, 443), pe **aplicație** (executabil specific), sau pe **subnet** (intervale de IP).

### Firewall dezactivat

Dacă oprești firewall-ul:

- pe rețea publică, oricine pe același WiFi îți poate scana PC-ul și exploata servicii vulnerabile;
- pe rețea privată riscul e mai mic dar tot există (un dispozitiv compromis în casă poate să atace mai departe).

**Nu opri firewall-ul** ca să rezolvi probleme de rețea. În schimb, adaugă o regulă de excepție pentru aplicația sau portul specific.

### VPN — extensie a firewall-ului

Un **VPN** (Virtual Private Network) creează un tunel criptat de la calculatorul tău spre un server remote. Toate pachetele trec prin tunel, deci ISP-ul vede doar „tip a deschis o conexiune cu serverul VPN", nu și siteurile pe care le vizitezi.

Folosit pentru:

- intimitate pe WiFi public;
- acces remote la rețeaua firmei (VPN corporate);
- ocolirea cenzurii și a geo-restricțiilor.

Servicii populare: ProtonVPN, Mullvad, NordVPN, WireGuard self-hosted.

### Echivalent pe Linux și macOS

**macOS** are un firewall integrat în _System Settings rezultă Network rezultă Firewall_, care funcționează la nivel de aplicație (per-app, similar cu Windows).

**Linux** folosește **iptables** sau succesorul modern **nftables** la nivel kernel, prin frontend-uri ca **ufw** (Uncomplicated Firewall) sau **firewalld**:

\`\`\`bash
# Activare ufw cu reguli sensibile
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
sudo ufw status verbose
\`\`\`

### Tendințe în 2026

- **Zero Trust networking** — modelul „nimeni nu e implicit de încredere, fiecare conexiune e autentificată separat", chiar și în rețeaua internă. Înlocuiește treptat modelul tradițional „firewall la perimetru, totul liber în interior".
- **eBPF** (Linux) permite reguli de firewall extrem de rapide, programabile, folosite de Cilium și de Cloudflare.
- **WAF** (Web Application Firewall) — filtre la nivel HTTP împotriva SQL injection, XSS — devin standard pentru orice site public, prin Cloudflare, AWS WAF sau Fastly.`,
  },
  {
    slug: `malware`,
    title: `MALWARE`,
    orderIndex: 10,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Malware — tipologia amenințărilor

**Malware** (de la _malicious software_) e termenul general pentru orice program scris cu intenție rea: să fure date, să blocheze calculatorul, să transforme PC-ul într-un zombie pentru atacuri DDoS, să afișeze reclame agresive. Cunoașterea tipurilor te ajută să recunoști atacurile când le vezi.

### Familiile principale

**Virus** — un fragment de cod care se atașează de un fișier executabil legitim și se execută când rulezi acel fișier. Tradițional, dar mai rar în 2026 pentru că antivirușii moderni îi detectează banal.

**Worm** — se replică **singur** și se propagă prin rețea sau email, fără să aibă nevoie ca utilizatorul să ruleze ceva. Un worm trimite copii prin lista ta de contacte. WannaCry (2017) e un exemplu celebru — a infectat sute de mii de PC-uri prin SMB.

**Trojan Horse** — pare un program legitim (un crack de joc, un editor video gratuit) dar instalează malware în spate. Spre deosebire de worm, nu se propagă singur; depinde de utilizator să-l descarce și să-l ruleze.

**Ransomware** — criptează fișierele de pe disc cu o cheie pe care o știe doar atacatorul, apoi cere bani (de obicei în Bitcoin) pentru a deschide. **Niciodată nu plăti** — e încurajare directă a atacului, plus că în jumătate din cazuri nu primești decriptarea. Backup-urile imutabile sunt singura apărare reală.

**Logic Bomb** — cod care se activează când se îndeplinește o condiție: o anumită dată, lipsa unui angajat din lista de salarii, deschiderea unui anumit fișier. Un fost angajat nemulțumit poate lăsa o bombă logică care se declanșează la o lună după plecarea lui.

**Spyware** — colectează discret date despre tine: ce siteuri vizitezi, ce tastezi, ce documente deschizi. Trimite informația către un server remote.

**Adware** — afișează reclame nedorite — popup-uri, bannere, pagini pornite în browser. Mai puțin distructiv, dar enervant și uneori e poartă pentru malware mai grav.

**Keylogger** — înregistrează **fiecare tastă apăsată**, inclusiv parole, numere de card, mesaje private. Trimite jurnalul atacatorului. Hardware keyloggers (mici dispozitive USB) există fizic — verifică tastatura unui calculator public înainte să introduci parola.

**Rootkit** — se ascunde adânc în sistem (uneori la nivel kernel sau firmware), greu de detectat și greu de șters. Necesită adesea reinstalare completă a sistemului de operare.

### Vectori non-tehnici — ingineria socială

Cea mai periculoasă „malware" nu e cod, ci manipulare:

**Phishing** — email sau SMS care imită o instituție legitimă (banca, curierul, ANAF, Microsoft) și te trimite spre o pagină falsă unde introduci parola sau cardul. Detalii care trădează: greșeli gramaticale, urgență artificială („contul va fi închis în 24h!"), URL-uri suspecte (\`microsoftt-login.com\`), expeditori cu domenii ciudate.

**Spear phishing** — phishing personalizat pentru o țintă specifică, folosind detalii reale despre tine (numele șefului, proiectul curent). Mult mai eficient decât phishing-ul de masă.

**Social Engineering** — manipulare psihologică în general. Un atacator sună pretinzând că e de la IT și te roagă „să-i confirmi parola" pentru un audit. Niciun departament IT serios nu îți va cere parola la telefon.

**Vishing** — phishing prin voce (apel telefonic).

**Smishing** — phishing prin SMS.

### Cum te aperi

1. **Antivirus actualizat** — Microsoft Defender pe Windows e gratuit și solid. Nu mai e nevoie de Norton sau McAfee pentru utilizator obișnuit.
2. **Update-uri la zi** — sistemul de operare, browser-ul, aplicațiile. Multe atacuri exploatează vulnerabilități deja patchuite, dar pe PC-uri cu update-uri ignorate.
3. **Cont Standard în loc de Administrator** pentru utilizare zilnică.
4. **Manager de parole + 2FA** — limitează daunele dacă o parolă scapă.
5. **Backup imutabil offline sau în cloud** — singura apărare contra ransomware.
6. **Gândire critică** — orice email cu „urgent click here" merită citit de două ori.

### Carantină vs ștergere

Când antivirusul detectează o amenințare, primul pas e **carantina** — fișierul e izolat, nu poate rula, dar e păstrat. Asta îți permite să **recuperezi** fișierele care sunt **fals pozitive** (legitime, dar detectate greșit). Ștergerea e definitivă; carantina e reversibilă.

### Echivalent pe Linux și macOS

Linux și macOS au mai puțin malware tradițional din cauza arhitecturii de permisiuni mai stricte și a cotei de piață mai mici. **ClamAV** (open source) și **rkhunter** scanează rootkits. Pe macOS, **Malwarebytes** și **XProtect** (integrat) acoperă majoritatea cazurilor.

\`\`\`bash
sudo clamscan -r /home/cristina/Downloads
sudo rkhunter --check
\`\`\`

### Tendințe în 2026

- **Ransomware-as-a-Service** — atacatori non-tehnici cumpără kit-uri gata făcute pe darknet.
- **AI-generated phishing** — emailuri scrise de modele lingvistice fără greșeli gramaticale, în orice limbă, personalizate per țintă. Detectarea devine mai grea.
- **Deepfake voice phishing** — imitația vocii unui șef sau părinte la telefon, cerând transferuri urgente.
- **Supply chain attacks** — compromiterea unei biblioteci open source folosite de mii de aplicații (cazul xz-utils, 2024).`,
  },
  {
    slug: `power-settings-safe-mode`,
    title: `POWER SETTINGS & SAFE MODE`,
    orderIndex: 11,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Setări de alimentare și Safe Mode

Cum gestionezi alimentarea afectează autonomia laptopului, viteza de pornire și consumul. Iar când ceva nu merge bine, **Safe Mode** e instrumentul universal de diagnosticare.

### Stările de alimentare

**Sleep (Standby / S3)** — RAM-ul rămâne alimentat, restul componentelor sunt oprite. Revenirea durează 1-2 secunde pentru că datele sunt deja în RAM. Consumul e mic (1-2 W pe laptop), dar non-zero — un laptop lăsat în Sleep o săptămână se descarcă complet.

**Hibernate (S4)** — conținutul RAM-ului e salvat pe disc (în fișierul \`hiberfil.sys\` din rădăcina C:), apoi calculatorul se oprește **complet**. Consum **zero**. La pornire, RAM-ul se reîncarcă din \`hiberfil.sys\` în câteva secunde — mai lent decât Sleep, dar mai rapid decât un boot complet și păstrează aplicațiile deschise.

**Hybrid Sleep** — combinație: RAM-ul rămâne alimentat (revenire rapidă) dar se face și un hiberfil (în caz de pană de curent, datele nu se pierd). Implicit pe desktop-uri.

**Modern Standby (S0ix)** — pe laptopuri noi, similar cu modul „phone-like": calculatorul rămâne semi-pornit, primește notificări, sincronizează email, dar consumă puțin. Înlocuiește Sleep tradițional pe Windows 11 cu hardware compatibil.

**Shutdown** — oprire completă, dar cu **fast startup** activ pe Windows 10/11, e un fel de hibernare parțială. Pentru un boot 100% curat, alegi _Restart_ în loc de _Shutdown rezultă Start_.

### Power Plans

În _Control Panel rezultă Power Options_ alegi între:

- **Balanced** — recomandat, automatică între performanță și economie. Setarea implicită.
- **Power Saver** — reduce frecvența CPU, oprește GPU dedicat, eficient pentru laptop pe baterie.
- **High Performance** — fără limitări, util pentru gaming sau randare.
- **Ultimate Performance** — disponibil pe Windows 10/11 Pro+ Workstation, dezactivează fine-tuning-ul de eficiență.

Pe laptopuri moderne, Windows 11 simplifică alegerea într-un singur **slider** din _Settings rezultă System rezultă Power & Battery_: Best power efficiency rezultă Balanced rezultă Best performance.

### Safe Mode — modul de salvare

**Safe Mode** pornește Windows cu **un set minimal de drivere și servicii**: doar cele esențiale pentru a încărca interfața. Util când:

- ai instalat un driver care provoacă ecran albastru;
- malware împiedică pornirea normală;
- vrei să dezinstalezi un program care nu se lasă șters în mod normal.

Trei variante:

- **Safe Mode** — clasic, fără rețea.
- **Safe Mode with Networking** — include drivere de rețea, ai internet (util pentru download de fix-uri sau scanare antivirus online).
- **Safe Mode with Command Prompt** — fără Explorer / Desktop, doar \`cmd.exe\`. Pentru depanare avansată.

### Cum intri în Safe Mode

Pe Windows 10/11:

1. _Shift + Restart_ din meniul Start.
2. _Troubleshoot rezultă Advanced options rezultă Startup Settings rezultă Restart_.
3. La reboot, apeși **4** pentru Safe Mode, **5** pentru Safe Mode with Networking, **6** pentru Safe Mode with Command Prompt.

Alternativ, din _Settings rezultă Update & Security rezultă Recovery rezultă Advanced startup rezultă Restart now_.

Tehnica veche cu **F8 la pornire** **nu mai funcționează** pe Windows 10/11 implicit — booturile sunt prea rapide. Poți reactiva cu:

\`\`\`powershell
bcdedit /set {default} bootmenupolicy legacy
\`\`\`

### WinRE — Windows Recovery Environment

Dacă Windows nu pornește deloc (trei boot-uri eșuate consecutiv), intră automat în **WinRE** — un mediu de recuperare care oferă System Restore, Reset PC, Command Prompt și Startup Repair. WinRE e stocat pe o partiție separată ascunsă.

### Echivalent pe Linux și macOS

**macOS** are **Safe Mode** (ții _Shift_ la pornire) — încarcă drivere minime și verifică discul. **Recovery Mode** (Cmd+R) dă acces la Disk Utility, reinstalare macOS, Terminal.

**Linux** intră în **single-user mode** sau **rescue mode** prin meniul GRUB (apeși _e_ când apare GRUB-ul și adaugi \`single\` sau \`init=/bin/bash\` la linia de kernel). Pe sisteme moderne cu systemd:

\`\`\`bash
sudo systemctl rescue           # mod rescue
sudo systemctl emergency        # și mai minimal
\`\`\`

### Tendințe în 2026

- **Wake-on-LAN** și **Wake-on-WiFi** permit pornirea calculatorului remote, util pentru administrare la distanță.
- **Modern Standby** devine standardul pe laptopuri ARM (Snapdragon X, Apple Silicon), oferind autonomie de 18-24 de ore.
- **Dynamic boost** — driverele moderne ridică automat performanța când e nevoie și o coboară imediat după, eliminând nevoia de a alege manual între planuri de putere.`,
  },
  {
    slug: `updates-drivers`,
    title: `UPDATES & DRIVERS`,
    orderIndex: 12,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Update-uri și drivere — cum păstrezi sistemul sănătos

Calculatorul nu e un televizor: nu îl cumperi și gata. Software-ul evoluează, vulnerabilitățile se descoperă, hardware-ul cere fix-uri. Politica „nu instalez nimic ca să nu strice" e cea mai sigură modalitate de a fi infectat.

### Cele trei utilitare cheie

**Disk Management** (\`diskmgmt.msc\`) — pentru gestionarea discurilor fizice. Aici **inițializezi un disc nou** (alegi MBR sau GPT), creezi sau ștergi partiții, formatezi, schimbi litere de drive. Nu se folosește pentru curățare de fișiere; e despre structură.

**Disk Cleanup** (\`cleanmgr.exe\`) sau **Storage Sense** — eliberează spațiu ștergând fișiere temporare, recycle bin, cache-uri de update-uri, folderul \`Windows.old\`. După un upgrade major poți recupera 20-30 GB.

**Device Manager** (\`devmgmt.msc\`) — singurul loc unde gestionezi **driverele**. Click-dreapta pe un dispozitiv rezultă _Update driver_, _Roll back driver_, _Uninstall device_, _Disable_.

### Tipuri de update-uri Windows

- **Quality updates** — patch-uri lunare de securitate (Patch Tuesday — a doua marți a fiecărei luni). Includ fix-uri pentru vulnerabilități CVE și mici corecții. Rapide, importante.
- **Feature updates** — versiuni majore (Windows 11 24H2, 25H2). O dată pe an, schimbă componente mai mari, includ noi funcționalități. Și ele includ adesea fix-uri de securitate.
- **Driver updates** — adesea livrate prin Windows Update, dar pot include și **drivere non-Microsoft** (Intel, NVIDIA, Realtek). Producătorii își semnează driverele pentru a fi distribuite prin Windows Update.
- **Optional updates** — drivere alternative, preview de feature update-uri, Microsoft Store app updates. Le găsești în _Settings rezultă Windows Update rezultă Advanced options rezultă Optional updates_.
- **Service Packs** — concept istoric (XP SP3, 7 SP1) — colecții mari de update-uri și patch-uri într-un singur instalator. Pe Windows 10/11 ideea a fost înlocuită cu feature updates.

### Active hours și restart-uri

În _Settings rezultă Windows Update rezultă Active hours_ stabilești intervalul în care nu vrei să se restarteze calculatorul. **Asta nu blochează instalarea** update-urilor — ele se descarcă și se instalează în fundal oricum. Active hours doar amână **restart-ul** pentru terminarea instalării. Update-urile critice se instalează indiferent de active hours.

### Update-uri istorice și uninstall

Lista cu update-uri instalate în _Settings rezultă Windows Update rezultă Update history_ permite să **dezinstalezi un update** care a stricat ceva. Click pe _Uninstall updates_ rezultă alegi update-ul rezultă confirmi.

### Driver troubleshooting

Când Windows Update nu găsește un driver pentru un dispozitiv, **asta nu înseamnă că nu există** — verifici **site-ul producătorului** (Lenovo, Dell, HP, ASUS). Producătorii lansează adesea drivere modernizate, certificate WHQL, optimizate pentru hardware-ul lor specific, înainte ca Microsoft să le includă.

**Best practice pentru driver problematic**:

1. _Device Manager rezultă click-dreapta dispozitiv rezultă Uninstall device_ (bifezi _Delete the driver software_ dacă vrei curățare completă).
2. Restart calculator.
3. Windows reinstalează automat un driver de bază sau cauți manual de pe site-ul producătorului.

### Roll back driver

În _Device Manager rezultă Properties rezultă Driver tab rezultă Roll Back Driver_. Funcționează **doar pentru versiunea anterioară** — Windows nu păstrează istoric infinit. Dacă instalezi v3 peste v2 peste v1, roll back duce la v2; ca să mergi la v1 instalezi manual.

### Echivalent pe Linux și macOS

**macOS** gestionează update-uri din _System Settings rezultă General rezultă Software Update_. Driverele pentru hardware Apple sunt incluse automat în macOS.

**Linux** are managere de pachete care actualizează **simultan sistemul, aplicațiile și driverele**:

\`\`\`bash
# Debian/Ubuntu
sudo apt update                      # refresh listă pachete
sudo apt upgrade                     # instalare update-uri

# Fedora/RHEL
sudo dnf upgrade

# Arch
sudo pacman -Syu

# Snap și Flatpak (universal)
sudo snap refresh
flatpak update
\`\`\`

Driverele pentru placa video NVIDIA pe Linux:

\`\`\`bash
# Ubuntu — instalare automată
sudo ubuntu-drivers autoinstall
\`\`\`

Pentru hardware fără driver în kernel, există DKMS (Dynamic Kernel Module Support) — modulele se recompilează automat la fiecare kernel nou.

### Tendințe în 2026

- **Windows Autopilot** și **Microsoft Intune** — companiile gestionează update-urile flotelor de zeci de mii de PC-uri din cloud, fără atingere fizică.
- **AI-assisted troubleshooting** — Windows 11 24H2+ folosește modele locale pentru a sugera fix-uri când un driver crash-uiește.
- **A/B updates** (modelul ChromeOS / Android) — sistemul ține două copii ale OS-ului și comută între ele la update, eliminând riscul de „update eșuat care lasă PC-ul ne-bootabil". Treptat ajunge și pe distribuții Linux și pe Windows IoT.`,
  },
  {
    slug: `mdm-byod-bitlocker`,
    title: `MDM, BYOD & BITLOCKER`,
    orderIndex: 13,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## MDM, BYOD și criptare — gestionarea dispozitivelor moderne

Când o firmă are 500 de angajați cu telefoane și laptopuri, fiecare conectat la email-ul corporate și la fișiere sensibile, controlul devine o problemă de scară. Răspunsul: **MDM** și politici clare de **BYOD**.

### MDM — Mobile Device Management

**MDM** e un set de tehnologii care permite IT-ului unei firme să **gestioneze dispozitivele mobile de la distanță**: să forțeze parole puternice, să instaleze aplicații, să șteargă date dacă telefonul e furat, să oprească camera în zone sensibile.

Soluții populare:

- **Microsoft Intune** — partea de MDM din Microsoft 365, integrat cu Azure AD.
- **VMware Workspace ONE** — fost AirWatch.
- **Jamf** — specializat pe Apple (iPhone, iPad, Mac).
- **Google Workspace MDM** — pentru organizații pe G Suite.

### BYOD vs corporate-owned

**BYOD** (Bring Your Own Device) — angajatul folosește propriul telefon / laptop pentru lucru. Avantaje pentru firmă: nu cumpără hardware. Dezavantaje: control mai puțin, conflict între intimitatea angajatului și nevoia de securitate.

**Corporate-owned** — firma cumpără și deține dispozitivul. Control total, dar costuri mari și flotă de gestionat.

**COPE** (Corporate-Owned, Personally Enabled) — compromis: firma deține, dar angajatul îl folosește și personal.

Practica modernă: **work profile** sau **container** — pe același telefon, datele de muncă sunt izolate de cele personale. Pe Android, _Work profile_; pe iOS, _User Enrollment_ + _Managed Apple ID_. IT-ul șterge profilul de muncă fără să atingă pozele cu copiii.

### Remote Wipe

Cea mai cerută funcționalitate: când Mihai pierde laptopul în taxi, IT-ul declanșează **remote wipe** — la prima conectare la internet, dispozitivul se șterge complet. Datele firmei nu ajung la cine găsește laptopul.

Variantele:

- **Full wipe** — șterge totul, ca un reset din fabrică.
- **Selective wipe** — șterge doar containerul cu date corporate, lăsând datele personale intacte (BYOD-friendly).

### BitLocker — criptare la nivel de disc pe Windows

**BitLocker** criptează toată partiția cu AES-128 sau AES-256. Fără cheie (sau parolă, sau TPM cu PIN), nimeni nu poate citi datele de pe disc, chiar dacă scoate fizic SSD-ul și îl conectează la alt PC.

Disponibilitate:

- **Windows 11 Home** — **NU are BitLocker**. Are **Device Encryption** (variantă simplificată, fără management granular), dar doar pe hardware compatibil InstantGo.
- **Windows 11 Pro / Enterprise / Education** — BitLocker complet, cu management.

BitLocker necesită:

- **TPM 2.0** (Trusted Platform Module) — un cip dedicat care păstrează cheia criptografică legată de hardware. Toate calculatoarele certificate Windows 11 trebuie să aibă TPM 2.0.
- Sau alternativă: cheie pe USB stick care trebuie introdus la pornire.

**BitLocker To Go** — varianta pentru **stick-uri USB și discuri externe**. Folositor când porți date sensibile între birouri.

### Recovery Key

Când activezi BitLocker, primești o **cheie de recuperare de 48 de cifre**. **Imprim-o, salvează-o într-un cont Microsoft, sau pune-o într-un manager de parole**. Fără ea, dacă TPM-ul se strică sau resetezi parola greșit, datele sunt pierdute pentru totdeauna.

### Echivalent pe Linux și macOS

**macOS** are **FileVault** — criptare full-disk activată dintr-un singur click în _System Settings rezultă Privacy & Security rezultă FileVault_. Cheia de recuperare se păstrează în iCloud (recomandat) sau local. Pe Apple Silicon, criptarea e accelerată hardware (Secure Enclave) și e implicit activă chiar și fără FileVault.

**Linux** are **LUKS** (Linux Unified Key Setup) — la instalarea Ubuntu/Fedora, bifezi _Encrypt the new installation_. Sub capotă:

\`\`\`bash
# Inspectarea unui dispozitiv criptat
sudo cryptsetup luksDump /dev/sda3

# Adăugarea unei chei alternative
sudo cryptsetup luksAddKey /dev/sda3
\`\`\`

LUKS suportă mai multe parole simultan (până la 8 keyslots) — utilă pentru un disc partajat între mai mulți utilizatori legitimi.

### Manageri MDM cross-platform

Soluții moderne ca **Intune** și **Jamf Pro** gestionează simultan iPhone-uri, iPad-uri, Mac-uri, Windows-uri, ChromeOS, Android. Politici uniforme indiferent de OS.

### Tendințe în 2026

- **Zero Trust pentru endpoints** — fiecare dispozitiv trebuie să-și demonstreze sănătatea (OS la zi, antivirus activ, criptare pornită) **înainte de fiecare conexiune** la resursele firmei. Conditional Access în Azure AD și Beyond Corp la Google sunt implementări tipice.
- **Hardware-backed device identity** — TPM și Secure Enclave devin obligatorii. Fără un cip de încredere, dispozitivul nu intră în rețeaua corporate.
- **Passkeys + MDM** — autentificare fără parole pe dispozitive gestionate, cu cheie cripto stocată în TPM.`,
  },
  {
    slug: `microsoft-services-active-directory`,
    title: `MICROSOFT SERVICES & ACTIVE DIRECTORY`,
    orderIndex: 14,
    durationMinutes: 13,
    isPreview: false,
    markdown: `## Servicii Microsoft și Active Directory — ecosistemul corporate

Microsoft 365 nu mai e doar Office. E o suită cloud completă în care emailul, fișierele, identitatea utilizatorilor, comunicarea video și gestionarea dispozitivelor sunt integrate. Lângă ea, **Active Directory** rămâne coloana vertebrală pentru identitatea în mii de organizații.

### Microsoft 365 — productivitate în cloud

**Microsoft 365** (rebrandul fostului Office 365) include:

- **Word, Excel, PowerPoint, Outlook** — variante desktop, web și mobile, sincronizate prin OneDrive.
- **OneDrive** — 1 TB stocare cloud per utilizator (în planul Business standard).
- **Microsoft Teams** — chat, apeluri video, întâlniri, canale de proiect, integrare cu fișiere SharePoint.
- **OneNote** — caiet digital cu „file" și „pagini", ideal pentru note de ședință și brainstorm. Compari cu un binder fizic cu separatoare colorate.
- **SharePoint** — portal intern al organizației: documente partajate cu permisiuni granulare, intranet, biblioteci de fișiere, liste, fluxuri de lucru.
- **Exchange Online** — server de email găzduit de Microsoft, cu calendar, contacte, întâlniri.
- **Forms** — formulare și sondaje.
- **Power Automate** — fluxuri de lucru automate (când vine email cu „factură", salvează atașamentul în SharePoint).

### Windows 365 — Cloud PC

**Windows 365** este un **PC virtual în cloud**. Te conectezi de pe orice dispozitiv (telefon, tabletă, Mac, Chromebook) și ai un Windows complet ce rulează pe servere Microsoft. Util pentru:

- angajați care lucrează pe dispozitive personale dar au nevoie de un Windows controlat;
- contractori temporari (le dezactivezi accesul după proiect);
- mobilitate fără hardware scump.

### Azure și serviciile cloud

**Microsoft Azure** e platforma cloud pentru companii — VM-uri, baze de date, AI, networking, storage. Concurează cu **AWS** (Amazon Web Services) și **Google Cloud Platform (GCP)**.

Trei modele cloud principale:

- **IaaS** (Infrastructure as a Service) — închiriezi servere virtuale (Azure VM, AWS EC2, GCP Compute Engine).
- **PaaS** (Platform as a Service) — închiriezi platforma de execuție, fără să te ocupi de OS (Azure App Service, AWS Elastic Beanstalk).
- **SaaS** (Software as a Service) — folosești aplicația finală (Microsoft 365, Gmail, Salesforce, Dropbox).

### Active Directory — identitate centralizată

**Active Directory (AD)** este serviciul Microsoft pentru gestionarea **utilizatorilor, grupurilor și calculatoarelor** într-o organizație, lansat în 2000. Avantajele unui domeniu AD:

- **Single Sign-On (SSO)** — Cristina se loghează o dată dimineața și are acces la toate calculatoarele, imprimantele și serverele organizației, fără să reintroducă parola. Credențialele se aplică în întreaga rețea.
- **Group Policy** — IT-ul aplică setări la mii de calculatoare deodată: ce wallpaper, ce parolă minimă, ce aplicații sunt permise.
- **Centralizare** — la concedierea unui angajat, IT dezactivează un singur cont AD și toate accesele dispar instant.

Ce **NU face** Active Directory:

- nu e motor de **căutare de fișiere** — pentru asta există Windows Search, indexarea SharePoint, Everything pentru desktop;
- nu permite ca **utilizatorii să-și configureze singuri drepturile** — doar admins din grupurile delegate pot face asta;
- chiar și **administratorii de domeniu pot fi blocați** dacă uită parola — politicile de lockout se aplică tuturor (un admin pierdut poate fi recuperat doar de la consola de domeniu cu un alt cont privilegiat).

### Group Policy vs Local Policy

Pe un PC standalone, **Local Group Policy Editor** (\`gpedit.msc\`) controlează setările PC-ului. Pe un PC în domeniu, **Group Policy** centralizat de pe controllerul de domeniu suprapune setările locale.

**Conflictul se rezolvă mereu în favoarea Group Policy de domeniu** — IT-ul corporativ poate forța setări care suprascriu deciziile utilizatorului local. De aceea în firme nu poți schimba wallpaper-ul sau dezinstala antivirusul: politica de domeniu te blochează.

\`\`\`powershell
gpupdate /force         # forțează aplicarea politicilor acum
gpresult /h raport.html # raport HTML cu politicile aplicate
\`\`\`

### Azure AD / Entra ID

În cloud, AD a evoluat în **Azure Active Directory**, redenumit **Microsoft Entra ID** în 2023. Diferențe față de AD on-prem:

- Identitate găzduită de Microsoft — fără server intern.
- Autentificare modernă (OAuth, SAML, OpenID Connect) pentru aplicații cloud.
- **Conditional Access** — reguli de tipul „dacă utilizatorul vine din afara țării, cere MFA suplimentar".
- Integrare nativă cu Microsoft 365.

Multe organizații rulează **hybrid** — AD on-prem sincronizat cu Entra ID — pentru a avea ambele lumi.

### Echivalent pe Linux și macOS

**Linux** are mai multe alternative la AD:

- **OpenLDAP** + **Kerberos** + **Samba** — combinație open source clasică.
- **FreeIPA** (Red Hat) — soluție integrată: LDAP + Kerberos + DNS + CA, cu interfață web.
- Multe organizații integrează Linux-urile direct într-un domeniu AD prin **realmd** și **sssd**:

\`\`\`bash
sudo realm join --user=admin firma.local
\`\`\`

**macOS** se poate înrola într-un domeniu AD nativ, sau via Jamf / Intune. Pentru organizații exclusiv Apple, există **Open Directory** (mai rar folosit acum).

### Tendințe în 2026

- **Cloud-first identity** — Entra ID, Okta, Google Workspace devin standardul pentru organizațiile noi. AD on-prem persistă în firme mari și sectoare reglementate.
- **Zero Trust** — fiecare cerere de acces e verificată independent, indiferent de rețea.
- **Federated identity** — utilizatorii se loghează la zeci de aplicații cu un singur cont organizațional, prin SAML și OIDC.
- **AI assistants integrați** — Microsoft Copilot apare în Word, Excel, Teams, Outlook, schimbând fluxul de lucru zilnic.`,
  },
  {
    slug: `desktop-event-viewer-misc`,
    title: `DESKTOP, EVENT VIEWER & MISC`,
    orderIndex: 15,
    durationMinutes: 14,
    isPreview: false,
    markdown: `## Desktop, Event Viewer și instrumente diverse — ultimele piese

Această lecție adună setări de personalizare, jurnalele de sistem și utilitarele zilnice pe care le folosești fără să le numești.

### Personalizarea Desktop-ului și Taskbar-ului

Click-dreapta pe Desktop rezultă _Personalize_ rezultă _Taskbar_, sau _Settings rezultă Personalization_. Ce poți schimba:

- **Locația Taskbar-ului** — sus, jos, stânga, dreapta. Pe Windows 11 limitarea: doar sus și jos (Microsoft a scos opțiunile laterale).
- **Iconițele din Taskbar** — pin / unpin aplicații.
- **Folderele afișate în meniul Start** — Documents, Downloads, Settings, etc.
- **Tema** — light / dark / contrast ridicat.

Ce **nu** poți schimba: **logo-ul butonului Start**. E fix, parte din Windows. Sunt utilitare third-party (StartIsBack, ExplorerPatcher) care permit asta, dar la riscul tău.

### Display settings

În _Settings rezultă System rezultă Display_ ai:

- **Display resolution** — 1920×1080, 2560×1440, 3840×2160, etc.
- **Scale** — 100%, 125%, 150% — mărește text și icoane pe ecrane înalte rezoluție.
- **Multiple displays** — extinde / duplică / doar al doilea / doar primul.

Pentru detalii avansate (refresh rate 60/120/144/240 Hz, HDR, color profile), intri în **Advanced display**. Acolo configurezi **monitorul de gaming** la frecvența maximă pe care o suportă.

### Cast / Wireless display

Pentru a împărți Desktop-ul cu un Smart TV wireless, mergi la _Settings rezultă System rezultă Display rezultă Connect to a wireless display_ (sau apeși **Win + K**). Funcționează prin **Miracast** — TV-ul trebuie să-l suporte.

### Ease of Access (Accessibility)

În _Settings rezultă Accessibility_ configurezi:

- **Narrator** — citire cu voce a textului de pe ecran (Win + Ctrl + Enter pentru a porni).
- **Magnifier** — lupă (Win + Plus).
- **High contrast** și teme pentru deficiențe vizuale.
- **Closed captions** și **Live captions** — subtitrare automată în timp real.
- **Voice access** — controlul calculatorului cu vocea.

### Snap Layouts

Tragi o fereastră în marginea ecranului și ocupă jumătate. **Win + Stânga / Dreapta / Sus / Jos** face același lucru cu tastatura. Pe Windows 11, **Win + Z** deschide layout-uri predefinite (2/3 + 1/3, 4 colțuri, etc.).

### Task Manager

**Ctrl + Shift + Esc** sau click-dreapta pe Taskbar rezultă _Task Manager_. Tabs:

- **Processes** — aplicații și fundal, CPU/RAM/Disk/Network per proces. Aici dai _End task_ pentru o aplicație blocată.
- **Performance** — grafice CPU, RAM, Disk, GPU.
- **App history** — consum cumulat per aplicație.
- **Startup apps** — ce pornește la boot. Dezactivează cele inutile pentru un boot mai rapid.
- **Users** — sesiuni active.
- **Details** — listă completă de procese cu PID, prioritate.
- **Services** — servicii Windows în execuție.

### Map Network Drive

Vrei să accesezi un folder de pe un server ca pe un disc local? În File Explorer rezultă click-dreapta pe _This PC rezultă Map network drive_. Alegi o literă liberă (Z:, Y:, X:) și introduci calea UNC: \`\\\\server\\share\`. De atunci, **Z:\\** se comportă ca un drive normal.

### Event Viewer — jurnalele sistemului

\`eventvwr.msc\` deschide **Event Viewer**, unde Windows înregistrează absolut tot ce se întâmplă: erori de aplicație, crash-uri de driver, autentificări, modificări de sistem.

**Cele patru log-uri principale**:

- **Application** — evenimente de la aplicații (Word a crash-uit, Outlook a pornit corect).
- **System** — evenimente de la kernel, drivere, servicii Windows.
- **Security** — autentificări reușite, autentificări eșuate, modificări de permisiuni. **Aici cauți dacă cineva a încercat să intre în contul tău.**
- **Setup** — evenimente la instalare și update-uri Windows.

**Pictograme și niveluri**:

- **Cerc roșu cu X** — Error: ceva a eșuat important.
- **Triunghi galben** — Warning: ceva e în neregulă, dar sistemul a continuat.
- **Cerc albastru cu i** — Information: eveniment normal, jurnalizat pentru audit.
- **Cheie** — Audit success / failure (în log-ul Security).

**Ghid de depanare**:

- Word crash-uiește la deschiderea unui document rezultă verifici **Application log** pentru detalii.
- Ecran albastru după update de driver rezultă verifici **System log** pentru evenimente legate de driver.
- Suspectezi că cineva a încercat să-ți ghicească parola rezultă **Security log**, evenimentul 4625 (logon failure).

### Tipuri de instalare Windows

- **Upgrade install** — păstrează aplicațiile, setările și fișierele. Trece de la 10 la 11 sau de la 23H2 la 24H2 fără să pierzi nimic.
- **Custom (Clean) install** — formatare partiție și pornire de la zero. Recomandat o dată la câțiva ani sau dacă sistemul e foarte instabil.
- **In-place repair install** — reinstalează Windows peste el însuși din ISO, păstrând datele. Reparează fișiere de sistem corupte.
- **Reset PC** — built-in: keep my files / remove everything (vezi lecția Backup).

### AUP — Acceptable Use Policy

**AUP** este documentul intern al unei firme care stabilește **regulile de folosire acceptabilă** a calculatoarelor și rețelei: ce site-uri sunt permise, dacă poți instala aplicații personale, ce date pot pleca prin email, cum se raportează un incident de securitate. Toți angajații semnează AUP la angajare. Încălcarea poate atrage sancțiuni disciplinare sau chiar concediere.

### Echivalent pe Linux și macOS

Jurnalele Linux clasice sunt în \`/var/log/\` (\`syslog\`, \`auth.log\`, \`kern.log\`). Pe sisteme cu systemd, \`journalctl\` le centralizează:

\`\`\`bash
journalctl -xe                 # ultimele evenimente cu detalii
journalctl -u nginx            # evenimente pentru un anumit serviciu
journalctl --since "1 hour ago"
journalctl -p err              # doar erori
\`\`\`

**macOS** are **Console.app** (similar cu Event Viewer) și \`log stream\` în Terminal:

\`\`\`bash
log stream --predicate 'eventMessage contains "kernel"'
\`\`\`

### Virtualizare — bonus

Pentru a rula un alt OS într-o fereastră (Linux pe Windows, Windows pe Mac), folosești **virtualizare**:

- **VirtualBox** — gratuit, cross-platform.
- **VMware Workstation / Fusion** — comercial, performanță superioară.
- **Hyper-V** — integrat în Windows 11 Pro.
- **Parallels Desktop** — popular pe Mac.
- **WSL2** (Windows Subsystem for Linux) — rulează un kernel Linux direct în Windows, cu acces la fișiere Windows și Linux deopotrivă.

### Tendințe în 2026

- **Windows 11 Copilot** integrează AI direct în Taskbar — răspunsuri rapide, generare de conținut, automatizări.
- **Snap Layouts** și ferestrele „lipite" cu zone predefinite devin standard pe macOS (Stage Manager) și GNOME / KDE pe Linux.
- **Cloud clipboard** și **Phone Link** sincronizează clipboard, notificări, apeluri SMS între PC și telefon.
- **Live captions** și **Voice access** ridică accesibilitatea la nivelul macOS și ChromeOS.`,
  },
];
