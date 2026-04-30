// Normalise the extracted raw question dump into a canonical shape
// matching lib/content/courses/types.ts.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const raw = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/questions.raw.json"), "utf8"),
);

const SKIP_TYPES = new Set(["hotspot", "match"]);

function slugId(topic, idx) {
  return `${topic}-${String(idx).padStart(3, "0")}`;
}

function normaliseOne(q) {
  // Source-detected variants:
  //  Variant A (python-test, pyyton-tests):
  //    { id, cat, type:"single"|"multi"|"yesno", q, o:[...], a:[idx]|[i,j], min?, e, statements?: [{text,correct}] }
  //  Variant B (test-python):
  //    { cat, q, o:[...], a:idx, e }   (single-only)
  //  Variant C (devices-questions1 + devices-questions2):
  //    { id, q?:string|text, options, correct:idx, explanation }
  //  Variant D (sql-questions):
  //    { id, text, options, correct:idx|[idx,idx], multi?:bool, explanation }

  const prompt = (q.q ?? q.text ?? "").trim();
  if (!prompt) return null;

  // Skip out-of-scope types
  if (SKIP_TYPES.has(q.type)) return null;

  // YESNO with statements array
  if (q.type === "yesno" && Array.isArray(q.statements)) {
    return {
      type: "yesno",
      topic: q.cat ?? "General",
      prompt,
      statements: q.statements.map((s) => ({
        text: String(s.text).trim(),
        correct: !!s.correct,
      })),
      explanation: (q.e ?? q.explanation ?? "").trim(),
    };
  }

  // MULTI variants
  // Variant A: type:"multi", a is array of indices
  // Variant D: multi:true, correct is array of indices
  const isMulti =
    q.type === "multi" ||
    q.multi === true ||
    (Array.isArray(q.correct) && q.correct.length > 1) ||
    (Array.isArray(q.a) && q.a.length > 1);

  const options = Array.isArray(q.o) ? q.o : Array.isArray(q.options) ? q.options : null;
  if (!options || options.length < 2) return null;

  if (isMulti) {
    let indices = q.a ?? q.correct;
    if (!Array.isArray(indices)) indices = [indices];
    const cleaned = indices.filter((n) => Number.isInteger(n) && n >= 0 && n < options.length);
    if (cleaned.length === 0) return null;
    return {
      type: "multi",
      topic: q.cat ?? "General",
      prompt,
      options: options.map(String),
      correctIndices: cleaned,
      min: q.min ?? cleaned.length,
      explanation: (q.e ?? q.explanation ?? "").trim(),
    };
  }

  // SINGLE variants
  let idx = q.a ?? q.correct;
  if (Array.isArray(idx)) idx = idx[0];
  if (!Number.isInteger(idx) || idx < 0 || idx >= options.length) return null;

  return {
    type: "single",
    topic: q.cat ?? "General",
    prompt,
    options: options.map(String),
    correctIndex: idx,
    explanation: (q.e ?? q.explanation ?? "").trim(),
  };
}

function dedupKey(n) {
  // Combine prompt + first option to make near-duplicates collide
  const head = n.prompt.replace(/\s+/g, " ").slice(0, 80).toLowerCase();
  const tail =
    n.type === "yesno"
      ? n.statements.map((s) => s.text).join("|").slice(0, 60)
      : n.options[0].slice(0, 60);
  return `${head}::${tail}`.toLowerCase();
}

const result = {};
const stats = {};
for (const topic of Object.keys(raw)) {
  const seen = new Map();
  const acc = [];
  let dropped = 0;
  let dups = 0;
  for (const q of raw[topic]) {
    const n = normaliseOne(q);
    if (!n) {
      dropped++;
      continue;
    }
    const k = dedupKey(n);
    if (seen.has(k)) {
      dups++;
      continue;
    }
    seen.set(k, true);
    acc.push(n);
  }
  acc.forEach((n, i) => (n.id = slugId(topic, i + 1)));
  result[topic] = acc;
  stats[topic] = { kept: acc.length, dropped, dups };
}

const outPath = path.join(ROOT, "scripts/questions.normalized.json");
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.error("Stats:");
for (const t of Object.keys(stats)) console.error(`  ${t}:`, stats[t]);
console.error(`\nWrote ${outPath}`);
