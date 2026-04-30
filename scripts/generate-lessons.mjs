// Generate lib/content/courses/<topic>/lessons.ts modules from the raw source
// material in repo root.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function tsTemplate(s) {
  return "`" + String(s).replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[ăâ]/g, "a")
    .replace(/[î]/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function writeLessonsModule(topic, lessons) {
  const target = path.join(ROOT, `lib/content/courses/${topic}/lessons.ts`);
  const body = lessons
    .map(
      (l) => `  {
    slug: ${tsTemplate(l.slug)},
    title: ${tsTemplate(l.title)},
    orderIndex: ${l.orderIndex},
    durationMinutes: ${l.durationMinutes},
    isPreview: ${l.isPreview},
    markdown: ${tsTemplate(l.markdown.trim())},
  }`,
    )
    .join(",\n");

  const out = `// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run \`node scripts/generate-lessons.mjs\` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
${body},
];
`;
  fs.writeFileSync(target, out);
  console.error(`Wrote ${target} (${lessons.length} lessons)`);
}

// ──────────────────────────────────────────────────────────────────────────
// SQL / Databases
// ──────────────────────────────────────────────────────────────────────────

function buildDatabasesLessons() {
  const study2 = fs.readFileSync(path.join(ROOT, "sql-study2.md"), "utf8");
  // Split sql-study2.md by "## CAPITOLUL N: ..." headings
  const chapters = [];
  const lines = study2.split("\n");
  let current = null;
  for (const line of lines) {
    const m = line.match(/^## CAPITOLUL (\d+): (.+)$/);
    if (m) {
      if (current) chapters.push(current);
      current = { number: Number(m[1]), title: m[2].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) chapters.push(current);

  // sql-study1.md is corrections — append its content as appendix to its chapter or a final review lesson
  const study1 = fs.readFileSync(path.join(ROOT, "sql-study1.md"), "utf8");

  // Group chapters into ~14 lessons by theme
  const groupings = [
    { idx: [1], title: "Ce este o bază de date relațională" },
    { idx: [2], title: "Chei: Primary, Foreign, Composite" },
    { idx: [3], title: "Normalizare — Prima Formă Normală (1NF)" },
    { idx: [4], title: "Tipuri de date" },
    { idx: [5], title: "CREATE TABLE — crearea tabelelor" },
    { idx: [6], title: "ALTER TABLE — modificarea structurii" },
    { idx: [7], title: "DROP, TRUNCATE, DELETE — diferențele care contează" },
    { idx: [8, 9, 10], title: "INSERT, UPDATE, DELETE — manipularea datelor" },
    { idx: [11], title: "SELECT — interogări de bază" },
    { idx: [12, 13], title: "GROUP BY, HAVING, ORDER BY" },
    { idx: [14], title: "JOIN-uri — combinarea tabelelor" },
    { idx: [15], title: "NULL — valorile lipsă" },
    { idx: [16, 21], title: "VIEW-uri și UNION" },
    { idx: [17], title: "Stored Procedures și Functions" },
    { idx: [18, 19], title: "Indexuri și Constraints" },
    { idx: [20], title: "Entity Relationship Diagrams (ERD)" },
    { idx: [22, 23], title: "Query practice — drag & drop pattern" },
    { idx: [24], title: "Recap final: DDL vs DML" },
  ];

  const lessons = [];
  groupings.forEach((g, i) => {
    const parts = g.idx
      .map((n) => chapters.find((c) => c.number === n))
      .filter(Boolean);
    if (parts.length === 0) return;
    const md =
      parts
        .map((p) => `## ${p.title}\n\n${p.body.join("\n").trim()}`)
        .join("\n\n---\n\n") + "\n";
    lessons.push({
      slug: slugify(g.title),
      title: g.title,
      orderIndex: i + 1,
      durationMinutes: Math.max(8, Math.min(20, Math.ceil(md.length / 800))),
      isPreview: i < 2,
      markdown: md,
    });
  });

  // Append the corrections doc as the final "cheat sheet" lesson
  lessons.push({
    slug: "cheat-sheet-curs-de-corectie",
    title: "Cheat sheet — capcane frecvente la examen",
    orderIndex: lessons.length + 1,
    durationMinutes: 10,
    isPreview: false,
    markdown: study1,
  });

  writeLessonsModule("sql", lessons);
}

// ──────────────────────────────────────────────────────────────────────────
// Python — extract sections array from python-course.jsx, convert blocks to MD
// ──────────────────────────────────────────────────────────────────────────

function extractArrayLiteral(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const m = src.match(re);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0;
  let i = start;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (c === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && next === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (c === "'" || c === '"') {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") i += 2;
        else i++;
      }
      i++;
      continue;
    }
    if (c === "`") {
      i++;
      while (i < src.length && src[i] !== "`") {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "$" && src[i + 1] === "{") {
          let td = 1;
          i += 2;
          while (i < src.length && td > 0) {
            if (src[i] === "{") td++;
            else if (src[i] === "}") td--;
            if (td > 0) i++;
          }
        }
        i++;
      }
      i++;
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
    i++;
  }
  return null;
}

function evalLiteral(src) {
  // eslint-disable-next-line no-new-func
  return new Function(`return ${src}`)();
}

function blockToMarkdown(item, lang) {
  if (item.type === "code") return "```" + lang + "\n" + item.code + "\n```";
  if (item.type === "rule") return `**Regulă.** ${item.text}`;
  if (item.type === "trap") return `> ⚠️ **Capcană.** ${item.text}`;
  if (item.type === "warning") return `> 🚨 **Atenție.** ${item.text}`;
  if (item.text) return item.text;
  return "";
}

function buildPythonLessons() {
  const src = fs.readFileSync(path.join(ROOT, "python-course.jsx"), "utf8");
  const lit = extractArrayLiteral(src, "sections");
  const sections = evalLiteral(lit);

  const lessons = sections.map((sec, i) => {
    const subBodies = sec.sub.map((sub) => {
      const md = sub.content.map((c) => blockToMarkdown(c, "python")).join("\n\n");
      return `### ${sub.title}\n\n${md}`;
    });
    const fullMd = `## ${sec.title}\n\n${subBodies.join("\n\n")}\n`;
    const numberless = sec.title.replace(/^\d+\.\s*/, "");
    return {
      slug: slugify(numberless),
      title: numberless,
      orderIndex: i + 1,
      durationMinutes: Math.max(10, Math.min(25, Math.ceil(fullMd.length / 800))),
      isPreview: i < 2,
      markdown: fullMd,
    };
  });

  writeLessonsModule("python", lessons);
}

// ──────────────────────────────────────────────────────────────────────────
// Devices — convert devices-cheatsheet.jsx sections (regex-driven, JSX is
// non-data so we walk the structure manually)
// ──────────────────────────────────────────────────────────────────────────

function buildDevicesLessons() {
  const src = fs.readFileSync(path.join(ROOT, "devices-cheatsheet.jsx"), "utf8");

  // Find each <Section id="..." title="..." emoji="..." [highlight]>...</Section>
  // and extract the title + inner JSX body.
  const sectionRe = /<Section\s+id="([^"]+)"\s+title="([^"]+)"\s+emoji="([^"]*)"[^>]*>([\s\S]*?)<\/Section>/g;
  const groups = [];
  let m;
  while ((m = sectionRe.exec(src))) {
    groups.push({ id: m[1], title: m[2], body: m[4] });
  }

  const lessons = groups.map((g, i) => {
    // Convert the JSX body to markdown by extracting <Row q="..." a="..." [warn]>,
    // <TF statement="..." answer="..." why="..." />, and free-text <p>.
    const bullets = [];

    // Heading marker for highlighted sections appears in source as `highlight={true}`
    // — already filtered out at title level.

    const rowRe = /<Row\s+q="([^"]+)"\s+a="([^"]+)"(?:\s+warn[^/]*)?\s*\/>/g;
    let r;
    while ((r = rowRe.exec(g.body))) {
      bullets.push(`- **${r[1]}** → ${r[2]}`);
    }

    const tfRe = /<TF\s+statement="([^"]+)"\s+answer="(TRUE|FALSE)"(?:\s+why="([^"]*)")?\s*\/>/g;
    let t;
    const trues = [];
    const falses = [];
    while ((t = tfRe.exec(g.body))) {
      const stmt = t[1];
      const ans = t[2];
      const why = t[3];
      const line = `- _"${stmt}"_ → **${ans}**${why ? ` — ${why}` : ""}`;
      if (ans === "TRUE") trues.push(line);
      else falses.push(line);
    }

    let md = `## ${g.title}\n\n`;
    if (bullets.length) {
      md += bullets.join("\n") + "\n\n";
    }
    if (trues.length || falses.length) {
      md += `### Adevărat / Fals\n\n`;
      if (trues.length) md += trues.join("\n") + "\n\n";
      if (falses.length) md += falses.join("\n") + "\n";
    }

    // Special-case the file systems table embedded in the FS section
    if (g.id === "fs") {
      md += `\n### Tabel comparativ NTFS / FAT32 / exFAT\n\n`;
      md += `| Caracteristică | NTFS | FAT32 | exFAT |\n`;
      md += `| --- | --- | --- | --- |\n`;
      md += `| Max file size | 16 TB | **4 GB** | 16 EB |\n`;
      md += `| Max partition | 256 TB | ~2 TB | 256 TB |\n`;
      md += `| Permissions | ✅ | ❌ | ❌ |\n`;
      md += `| Encryption (EFS) | ✅ | ❌ | ❌ |\n`;
      md += `| Compatibility | Windows | Universal | Modern devices |\n`;
      md += `| Best for | Windows drive | USB legacy | Flash drives |\n\n`;
    }

    return {
      slug: slugify(g.title),
      title: g.title,
      orderIndex: i + 1,
      durationMinutes: Math.max(8, Math.min(20, Math.ceil(md.length / 800))),
      isPreview: i < 2,
      markdown: md,
    };
  });

  writeLessonsModule("devices", lessons);
}

buildDatabasesLessons();
buildPythonLessons();
buildDevicesLessons();
