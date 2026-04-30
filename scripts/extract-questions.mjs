// Extract question arrays from JSX dump files.
// Arrays are plain JS data literals (no JSX inside) — safe to eval.
// Bracket balancing must skip strings + comments.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FILES = [
  { file: "python-test.jsx", topic: "python", arr: "Q" },
  { file: "pyyton-tests.jsx", topic: "python", arr: "Q" },
  { file: "test-python.jsx", topic: "python", arr: "questions" },
  { file: "devices-questions1.jsx", topic: "devices", arr: "questions" },
  { file: "devices-questions2.jsx", topic: "devices", arr: "questions" },
  { file: "questions-sql1.jsx", topic: "sql", arr: "questions" },
  { file: "sql-questions2.jsx", topic: "sql", arr: "questions" },
];

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

    // line comment
    if (c === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    // block comment
    if (c === "/" && next === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    // single-quoted string
    if (c === "'") {
      i++;
      while (i < src.length && src[i] !== "'") {
        if (src[i] === "\\") i += 2;
        else i++;
      }
      i++;
      continue;
    }
    // double-quoted string
    if (c === '"') {
      i++;
      while (i < src.length && src[i] !== '"') {
        if (src[i] === "\\") i += 2;
        else i++;
      }
      i++;
      continue;
    }
    // template literal
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

const out = {};
for (const { file, topic, arr } of FILES) {
  const full = path.join(ROOT, file);
  const src = fs.readFileSync(full, "utf8");
  const lit = extractArrayLiteral(src, arr);
  if (!lit) {
    console.error(`[!] No array '${arr}' found in ${file}`);
    continue;
  }
  let data;
  try {
    data = evalLiteral(lit);
  } catch (e) {
    console.error(`[!] eval failed for ${file}:`, e.message);
    continue;
  }
  if (!Array.isArray(data)) {
    console.error(`[!] ${file}: ${arr} is not an array`);
    continue;
  }
  if (!out[topic]) out[topic] = [];
  for (const q of data) out[topic].push({ ...q, _src: file });
  console.error(`[ok] ${file}: ${data.length} entries (topic=${topic})`);
}

const outPath = path.join(ROOT, "scripts", "questions.raw.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.error(`\nWrote ${outPath}`);
console.error("Totals:");
for (const t of Object.keys(out)) console.error(`  ${t}: ${out[t].length}`);
