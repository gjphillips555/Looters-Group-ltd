import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const dir = dirname(fileURLToPath(import.meta.url));
const b64 = (
  readFileSync(join(dir, "title.b64.1.txt"), "utf8").trim() +
  readFileSync(join(dir, "title.b64.2.txt"), "utf8").trim()
);
const out = join(dir, "../public/brand/logos/title.png");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(b64, "base64"));
console.log("wrote", out, Buffer.from(b64, "base64").length);
