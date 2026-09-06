#!/usr/bin/env node
/**
 * Scan public/ and write public/asset-manifest.json
 * (path → size, sha256, mtime) for deploy verification.
 */
import { createHash } from "node:crypto";
import { createReadStream, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outFile = path.join(publicDir, "asset-manifest.json");

const SKIP = new Set(["node_modules", ".git", "__pycache__"]);

function walk(dir, base = publicDir, list = []) {
  if (!existsSync(dir)) return list;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, base, list);
    else if (st.isFile()) {
      const rel = path.relative(base, full).split(path.sep).join("/");
      list.push({ full, rel, size: st.size, mtime: st.mtime.toISOString() });
    }
  }
  return list;
}

async function sha256(file) {
  return new Promise((resolve, reject) => {
    const h = createHash("sha256");
    createReadStream(file)
      .on("data", (c) => h.update(c))
      .on("end", () => resolve(h.digest("hex")))
      .on("error", reject);
  });
}

const files = walk(publicDir).sort((a, b) => a.rel.localeCompare(b.rel));
const assets = {};
let total = 0;
for (const f of files) {
  if (f.rel === "asset-manifest.json") continue;
  const hash = await sha256(f.full);
  assets[f.rel] = { size: f.size, sha256: hash, mtime: f.mtime };
  total += f.size;
}

const manifest = {
  generatedAt: new Date().toISOString(),
  root: "public",
  fileCount: Object.keys(assets).length,
  totalBytes: total,
  assets,
};

writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${path.relative(root, outFile)}`);
console.log(`  ${manifest.fileCount} files, ${(total / 1e6).toFixed(2)} MB`);
