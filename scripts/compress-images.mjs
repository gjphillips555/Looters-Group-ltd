#!/usr/bin/env node
/**
 * Node entrypoint for the image compression pipeline.
 * Delegates to scripts/compress-images.py (Pillow).
 *
 *   npm run images:compress
 *   npm run images:compress -- --dry-run
 *   npm run images:compress -- --webp --root public/brand
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, "compress-images.py");
const extra = process.argv.slice(2);

const py = process.env.PYTHON || "python3";
const result = spawnSync(py, [script, ...extra], {
  stdio: "inherit",
  shell: false,
  env: process.env,
});

if (result.error) {
  console.error("Failed to run Python compressor:", result.error.message);
  console.error("Install Pillow: pip install Pillow");
  process.exit(1);
}
process.exit(result.status ?? 1);
