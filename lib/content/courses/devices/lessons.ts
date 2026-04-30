// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run `node scripts/generate-lessons.mjs` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
  {
    slug: `file-systems-ntfs-fat32-exfat`,
    title: `FILE SYSTEMS — NTFS / FAT32 / exFAT`,
    orderIndex: 1,
    durationMinutes: 8,
    isPreview: true,
    markdown: `## FILE SYSTEMS — NTFS / FAT32 / exFAT

### Adevărat / Fals

- _"ExFAT ideal for flash drives, up to 256TB"_ → **TRUE** — Creat special pt flash drives

- _"NTFS supports a max file size of 4GB"_ → **FALSE** — Asta e limita FAT32! NTFS = 16TB
- _"FAT32 supports partitions up to 32TB"_ → **FALSE** — Max ~2TB

### Tabel comparativ NTFS / FAT32 / exFAT

| Caracteristică | NTFS | FAT32 | exFAT |
| --- | --- | --- | --- |
| Max file size | 16 TB | **4 GB** | 16 EB |
| Max partition | 256 TB | ~2 TB | 256 TB |
| Permissions | ✅ | ❌ | ❌ |
| Encryption (EFS) | ✅ | ❌ | ❌ |
| Compatibility | Windows | Universal | Modern devices |
| Best for | Windows drive | USB legacy | Flash drives |`,
  },
  {
    slug: `backup-restore`,
    title: `BACKUP & RESTORE`,
    orderIndex: 2,
    durationMinutes: 8,
    isPreview: true,
    markdown: `## BACKUP & RESTORE

- **Backup automat, offline, versiuni anterioare?** → File History
- **Disk space crescut după upgrade?** → Disk Cleanup (șterge Windows.old)
- **System Restore șterge fișiere?** → NU — doar setări/drivere/apps
- **Reset (Keep files)?** → Reinstalează Windows, păstrează fișierele, șterge apps
- **Reset (Remove everything)?** → Șterge ABSOLUT TOT
- **Blue screen de la driver nou?** → System Restore (revii înainte de instalare)

### Adevărat / Fals

- _"Windows Backup → back up to cloud"_ → **TRUE** — OneDrive
- _"Windows Backup → back up passwords"_ → **TRUE**

- _"Windows Backup → back up to physical media"_ → **FALSE** — Asta e Backup and Restore (vechi)`,
  },
  {
    slug: `windows-registry`,
    title: `WINDOWS REGISTRY`,
    orderIndex: 3,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## WINDOWS REGISTRY

- **Ce stochează?** → Profiles, application settings, hardware drivers

### Adevărat / Fals

- _"Persistent across restarts"_ → **TRUE** — E pe disc
- _"Installers can modify registry"_ → **TRUE**

- _"Changes backed up to OneDrive"_ → **FALSE** — Local only
- _"Third-party installers cannot change Registry"_ → **FALSE** — Pot!
- _"Deleting shortcut uninstalls app"_ → **FALSE** — Shortcut ≠ uninstall`,
  },
  {
    slug: `accounts-uac`,
    title: `ACCOUNTS & UAC`,
    orderIndex: 4,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## ACCOUNTS & UAC

- **Manage system files (Win 10 Home)?** → Administrator Account
- **Multiple devices + Microsoft services?** → Microsoft Account
- **Consent prompt la install software?** → UAC (NU Windows Defender!)

### Adevărat / Fals

- _"UAC prompt when Standard User installs in Program Files"_ → **TRUE**

- _"64-bit apps → Program Files (x86)"_ → **FALSE** — x86 = 32-bit!
- _"Deleting app folder removes registry"_ → **FALSE** — Folosește uninstaller`,
  },
  {
    slug: `authenticator-windows-hello`,
    title: `AUTHENTICATOR & WINDOWS HELLO`,
    orderIndex: 5,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## AUTHENTICATOR & WINDOWS HELLO

### Adevărat / Fals

- _"Authenticator: generates TOTP for MFA"_ → **TRUE** — Coduri la 30 sec
- _"IR camera needed for facial recognition"_ → **TRUE** — Windows Hello Face

- _"Authenticator: push notifications for local AND Microsoft accounts"_ → **FALSE** — Doar Microsoft/Azure AD
- _"Authenticator: login if you forget password"_ → **FALSE** — E 2FA, nu înlocuiește parola
- _"Microsoft account necessary for facial recognition"_ → **FALSE** — Merge și cu cont local
- _"If face rec fails, auto-logged in with password"_ → **FALSE** — Trebuie introdus manual`,
  },
  {
    slug: `hardware-ram-gpu-motherboard`,
    title: `HARDWARE — RAM, GPU, MOTHERBOARD`,
    orderIndex: 6,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## HARDWARE — RAM, GPU, MOTHERBOARD

### Adevărat / Fals

- _"Physical storage includes SSD, HDD, flash drives"_ → **TRUE**
- _"Restart wipes RAM"_ → **TRUE**
- _"Opening program loads into RAM"_ → **TRUE**
- _"VGA, DVI, HDMI, DisplayPort = GPU outputs"_ → **TRUE**
- _"Max RAM capacity determined by motherboard"_ → **TRUE**
- _"BIOS stored on motherboard"_ → **TRUE** — Chip + baterie CMOS

- _"RAM is non-volatile"_ → **FALSE** — E VOLATILĂ — pierde tot la oprire
- _"Low latency HDD faster than SSD"_ → **FALSE** — SSD mereu mai rapid
- _"RAM slower than HDD"_ → **FALSE** — RAM = zeci de mii de ori mai rapid
- _"Integrated GPU have own built-in memory"_ → **FALSE** — Folosesc RAM-ul sistemului
- _"GPU can access peripherals to help CPU"_ → **FALSE**
- _"Intel to AMD without changing MB"_ → **FALSE** — Socket-uri diferite`,
  },
  {
    slug: `conectori-porturi`,
    title: `CONECTORI & PORTURI`,
    orderIndex: 7,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## CONECTORI & PORTURI

- **Power + data** → USB Type-C
- **Legacy monitors** → VGA
- **Monitors & PCs, NOT consoles** → DisplayPort
- **TV, PC, console, projector** → HDMI
- **mini-HDMI** → Tablete, camere foto
- **DisplayPort** → Audio & Video
- **VGA** → Video ONLY (analog, fără sunet)
- **HDMI** → Audio & Video
- **S/PDIF Optical** → Audio ONLY`,
  },
  {
    slug: `network-troubleshooting`,
    title: `NETWORK & TROUBLESHOOTING`,
    orderIndex: 8,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## NETWORK & TROUBLESHOOTING

- **IP address + default gateway?** → ipconfig
- **169.254.x.x?** → APIPA — no DHCP, no internet
- **SSID visible, nimeni nu se conectează?** → Reboot access point/router
- **Refresh Group Policy?** → gpupdate /force
- **gpresult?** → doar ARATĂ politicile (nu le aplică)
- **Smartphone nu e recunoscut, update driver?** → Device Manager
- **Microsoft Store install issue?** → WSReset.exe
- **Legacy printer, USB-to-serial, baud rate?** → Ports (COM & LPT)
- **Printer conflict, Printers folder lipsește?** → View > Show hidden devices`,
  },
  {
    slug: `firewall-network-profiles`,
    title: `FIREWALL & NETWORK PROFILES`,
    orderIndex: 9,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## FIREWALL & NETWORK PROFILES

- **Cafenea / aeroport / loc public?** → Public (restrictiv, PC ascuns)
- **Acasă / birou?** → Private (sharing ON, PC vizibil)
- **Firewall dezactivat?** → PC vulnerabil la acces neautorizat
- **Firewall ≠ Antivirus?** → DA! Firewall = conexiuni. Antivirus = fișiere malware`,
  },
  {
    slug: `malware`,
    title: `MALWARE`,
    orderIndex: 10,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## MALWARE

- **Se replică, spread by email** → Worm
- **Criptează date, cere bani** → Ransomware
- **Pare program legitim** → Trojan Horse
- **Code triggered by condition** → Logic Bomb
- **Colectează date pe ascuns** → Spyware
- **Afișează reclame nedorite** → Adware
- **Email fals, fură date personale** → Phishing
- **Înregistrează tastele apăsate** → Keylogger
- **Manipulare psihologică** → Social Engineering
- **False positive în carantină?** → Recover from quarantine (NU delete!)`,
  },
  {
    slug: `power-settings-safe-mode`,
    title: `POWER SETTINGS & SAFE MODE`,
    orderIndex: 11,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## POWER SETTINGS & SAFE MODE

- **Sleep** → RAM alimentată, revenire rapidă, consum mic
- **Hibernate** → RAM → disc, oprire totală, consum ZERO
- **Balanced** → Power plan recomandat (default)
- **Safe Mode** → Drivere minime, diagnostic
- **Safe Mode with Networking** → + acces la internet
- **Safe Mode with Command Prompt** → Doar CMD, fără GUI
- **Cum accesezi?** → Shift + Restart sau Settings > Recovery`,
  },
  {
    slug: `updates-drivers`,
    title: `UPDATES & DRIVERS`,
    orderIndex: 12,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## UPDATES & DRIVERS

- **Disk Management** → Inițializare, partiționare, formatare disc NOU
- **Disk Cleanup** → Eliberare spațiu (fișiere temp, Windows.old)
- **Device Manager** → Drivere: update, rollback, uninstall

### Adevărat / Fals

- _"Optional updates from Advanced Options"_ → **TRUE**
- _"Uninstall updates under update history"_ → **TRUE**
- _"Feature updates sometimes address security"_ → **TRUE**
- _"Service packs = collection of updates/patches"_ → **TRUE**
- _"Driver updates include non-Microsoft drivers"_ → **TRUE**
- _"Uninstall driver, restart, then reinstall = best practice"_ → **TRUE**

- _"Required updates only install when active hours set"_ → **FALSE** — Se instalează oricum
- _"Windows not finding driver = no update exists"_ → **FALSE** — Verifică site producător
- _"Roll back to ANY previous version"_ → **FALSE** — Doar versiunea anterioară`,
  },
  {
    slug: `mdm-byod-bitlocker`,
    title: `MDM, BYOD & BITLOCKER`,
    orderIndex: 13,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## MDM, BYOD & BITLOCKER

- **MDM?** → Gestionare dispozitive mobile de la distanță
- **BYOD?** → Bring Your Own Device
- **Remote Wipe?** → Șterge date de la distanță (telefon pierdut/furat)
- **BitLocker disponibil pe Home?** → NU! Doar Pro/Enterprise/Education
- **BitLocker necesită?** → TPM (Trusted Platform Module)
- **BitLocker To Go?** → Criptare USB drives`,
  },
  {
    slug: `microsoft-services-active-directory`,
    title: `MICROSOFT SERVICES & ACTIVE DIRECTORY`,
    orderIndex: 14,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## MICROSOFT SERVICES & ACTIVE DIRECTORY

- **Cloud productivity apps** → Microsoft 365
- **Binder with tabs/sections** → OneNote
- **Document collaboration org** → SharePoint
- **Virtual PC in cloud** → Windows 365
- **Local Policy vs Group Policy conflict?** → Group Policy CÂȘTIGĂ mereu

### Adevărat / Fals

- _"AD: credentials throughout network"_ → **TRUE** — Single Sign-On

- _"AD: efficient file searching"_ → **FALSE** — AD ≠ file search
- _"AD: all users configure own rights"_ → **FALSE** — Doar admins
- _"Domain admins prevented from lockouts"_ → **FALSE** — Pot fi blocați`,
  },
  {
    slug: `desktop-event-viewer-misc`,
    title: `DESKTOP, EVENT VIEWER & MISC`,
    orderIndex: 15,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## DESKTOP, EVENT VIEWER & MISC

- **Logo Start button** → ❌ NO
- **Taskbar location** → ✅ YES
- **Display resolution** → ✅ YES
- **Folders in Start menu** → ✅ YES
- **🔴 Cerc roșu** → Error — problemă serioasă
- **⚠️ Triunghi galben** → Warning — potențială problemă
- **ℹ️ Cerc albastru** → Information — eveniment normal
- **Word crashes → ce log?** → Application
- **Driver errors → ce log?** → System
- **Logări/autentificări → ce log?** → Security
- **Monitor resolution + refresh rate?** → Advanced display
- **Narrator settings?** → Ease of Access
- **Share desktop → smart TV wireless?** → Display (Settings > System)
- **Task Manager — end non-responding?** → Processes tab
- **Map Network Drive?** → Literă de drive pt folder din rețea (ex: Z:\)
- **Snap?** → Fereastră trasă în margine = jumătate ecran
- **Upgrade vs Custom install?** → Upgrade = păstrează tot, Custom = la zero
- **AUP?** → Reguli de folosire acceptabilă la muncă`,
  },
];
