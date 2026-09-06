#!/usr/bin/env node
/**
 * Automated public asset pipeline:
 *  1. Optional image compression (brand)
 *  2. Build asset manifest
 *  3. Git add/commit/push public/ when --push (requires git + remote auth)
 *
 *   npm run assets:deploy
 *   npm run assets:deploy -- --push
 *   npm run assets:deploy -- --skip-compress --push
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const skipCompress = args.has("--skip-compress");
const doPush = args.has("--push");
const dryRun = args.has("--dry-run");

function run(cmd, cmdArgs, opts = {}) {
  console.log(`\n> ${cmd} ${cmdArgs.join(" ")}`);
  const r = spawnSync(cmd, cmdArgs, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    env: process.env,
    ...opts,
  });
  if (r.status !== 0 && !opts.allowFail) {
    process.exit(r.status ?? 1);
  }
  return r.status ?? 0;
}

console.log("=== Looters asset deploy ===");
console.log(`root: ${root}`);
console.log(`compress: ${!skipCompress}  push: ${doPush}  dry-run: ${dryRun}`);

if (!skipCompress) {
  const py = process.env.PYTHON || "python3";
  const compress = path.join(__dirname, "compress-images.py");
  if (existsSync(compress)) {
    run(py, [compress, "--root", "public/brand", "--webp", "--min-bytes", "12000"]);
  } else {
    console.warn("compress-images.py missing — skip compress");
  }
}

run(process.execPath, [path.join(__dirname, "asset-manifest.mjs")]);

if (dryRun) {
  console.log("\nDry run — not staging git.");
  process.exit(0);
}

const git = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], {
  cwd: root,
  encoding: "utf8",
});
if (git.status !== 0) {
  console.warn("Not a git work tree — manifest written; skip commit/push.");
  process.exit(0);
}

run("git", ["add", "-A", "public"], { allowFail: true });
const st = spawnSync("git", ["status", "--porcelain", "public"], {
  cwd: root,
  encoding: "utf8",
});
const dirty = (st.stdout || "").trim();
if (!dirty) {
  console.log("\nNo public/ changes to commit.");
} else {
  console.log("\nStaged public changes:\n" + dirty);
  if (doPush) {
    const msg =
      process.env.ASSET_COMMIT_MSG ||
      `chore(assets): deploy public brand media ${new Date().toISOString().slice(0, 10)}`;
    run("git", ["commit", "-m", msg], { allowFail: true });
    const branch =
      process.env.ASSET_BRANCH ||
      spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: root,
        encoding: "utf8",
      }).stdout.trim() ||
      "main";
    run("git", ["push", "origin", branch], { allowFail: true });
    console.log("\nPush attempted → Vercel should rebuild if the project is linked to this repo.");
  } else {
    console.log("\nStaged only. Re-run with --push to commit + push.");
  }
}

console.log("\nDone.");
