// Convert questions.normalized.json into TypeScript content modules.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/questions.normalized.json"), "utf8"),
);

function tsString(s) {
  // Use template literal so Romanian curly quotes pass through safely.
  // Escape backticks + ${ pairs.
  const safe = String(s).replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return "`" + safe + "`";
}

function serialiseQuestion(q) {
  if (q.type === "single") {
    return `  {
    id: ${tsString(q.id)},
    type: "single",
    topic: ${tsString(q.topic)},
    prompt: ${tsString(q.prompt)},
    options: [${q.options.map(tsString).join(", ")}],
    correctIndex: ${q.correctIndex},
    explanation: ${tsString(q.explanation)},
  }`;
  }
  if (q.type === "multi") {
    return `  {
    id: ${tsString(q.id)},
    type: "multi",
    topic: ${tsString(q.topic)},
    prompt: ${tsString(q.prompt)},
    options: [${q.options.map(tsString).join(", ")}],
    correctIndices: [${q.correctIndices.join(", ")}],
    min: ${q.min},
    explanation: ${tsString(q.explanation)},
  }`;
  }
  if (q.type === "yesno") {
    return `  {
    id: ${tsString(q.id)},
    type: "yesno",
    topic: ${tsString(q.topic)},
    prompt: ${tsString(q.prompt)},
    statements: [
${q.statements
  .map((s) => `      { text: ${tsString(s.text)}, correct: ${s.correct} }`)
  .join(",\n")},
    ],
    explanation: ${tsString(q.explanation)},
  }`;
  }
  throw new Error("unknown type: " + q.type);
}

const TOPICS = [
  { topic: "python", folder: "python" },
  { topic: "devices", folder: "devices" },
  { topic: "sql", folder: "sql" },
];

for (const { topic, folder } of TOPICS) {
  const items = data[topic] ?? [];
  const body = items.map(serialiseQuestion).join(",\n");
  const out = `// AUTO-GENERATED from scripts/questions.normalized.json — do not edit by hand.
// Re-run \`node scripts/generate-question-modules.mjs\` after extracting fresh content.

import type { Question } from "../types";

export const questions: readonly Question[] = [
${body},
];
`;
  const target = path.join(ROOT, `lib/content/courses/${folder}/questions.ts`);
  fs.writeFileSync(target, out);
  console.error(`Wrote ${target} (${items.length} questions)`);
}
