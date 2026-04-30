import type { CourseMeta } from "../types";

export const meta: CourseMeta = {
  slug: "devices",
  title: "Devices — Certiport IT Specialist",
  blurb:
    "Sisteme de fișiere, conturi, registry, hardware, rețea, securitate. Cea mai rapidă cale spre 10 din oficiu.",
  description:
    "Cursul Certiport Device Configuration & Management este cel mai accesibil dintre toate. Învățăm sistemele de fișiere (NTFS / FAT32 / exFAT), backup și restore, registry, conturi și UAC, hardware (RAM, GPU, motherboard), conectori, rețea, firewall, malware, power settings, BitLocker, MDM, Active Directory și Event Viewer. Cheat-sheet final cu toate capcanele examen.",
  duration: "5–8 ore",
  difficulty: "începător",
  icon: "/courses/networking-devices.png",
  accent: "warning",
  passingScore: 70,
  topics: [
    "File systems și formate",
    "Backup, Restore, System Restore",
    "Registry și conturi (Microsoft / Local)",
    "UAC, MFA, Windows Hello",
    "Hardware: RAM, GPU, Motherboard",
    "Conectori și porturi",
    "Network troubleshooting",
    "Firewall, Malware, Power, MDM, BitLocker",
  ],
};
