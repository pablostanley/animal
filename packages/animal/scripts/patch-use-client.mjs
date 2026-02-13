import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const targets = [
  path.join(ROOT, "dist", "react", "index.js"),
  path.join(ROOT, "dist", "react", "index.cjs"),
];

const directive = "'use client';\n";

for (const file of targets) {
  if (!fs.existsSync(file)) continue;

  const src = fs.readFileSync(file, "utf8");
  const trimmed = src.slice(0, 40);

  if (trimmed.startsWith("'use client'") || trimmed.startsWith('"use client"')) continue;
  fs.writeFileSync(file, directive + src, "utf8");
}

