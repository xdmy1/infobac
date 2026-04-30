import type { CourseMeta } from "../types";

export const meta: CourseMeta = {
  slug: "devices",
  title: "Devices — Certiport IT Specialist",
  blurb:
    "Sisteme de fișiere, conturi, registry, hardware, rețea, securitate. Cea mai rapidă cale spre 10 din oficiu.",
  description:
    "Cea mai accesibilă certificare Certiport. Materie compactă, fără concepte abstracte — perfect ca să prinzi 10 din oficiu rapid.",
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
