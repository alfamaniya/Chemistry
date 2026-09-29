import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

const elementIndex = readJson("data/elements-index.json");
if (!Array.isArray(elementIndex) || elementIndex.length !== 118) {
  throw new Error("data/elements-index.json must contain exactly 118 elements.");
}

const atomicNumbers = elementIndex.map((element) => element.atomic_number);
if (atomicNumbers.some((number, index) => number !== index + 1)) {
  throw new Error("Element atomic numbers must be consecutive from 1 to 118.");
}

const fa = readJson("locales/fa.json");
const en = readJson("locales/en.json");
const faKeys = Object.keys(fa).sort();
const enKeys = Object.keys(en).sort();
if (JSON.stringify(faKeys) !== JSON.stringify(enKeys)) {
  throw new Error("fa.json and en.json must expose the same translation keys.");
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const key of ["pageTitle", "description", "searchPlaceholder", "periodicTableTitle"]) {
  if (!html.includes(`data-i18n="${key}"`) && key !== "pageTitle") {
    throw new Error(`Missing expected i18n key in index.html: ${key}`);
  }
}
if (!html.includes('id="periodic-table-status"') || html.includes('id="periodic-table" aria-live')) {
  throw new Error("Periodic table live status must be separate from the 118-card container.");
}

const scriptDir = path.join(root, "scripts");
for (const file of fs.readdirSync(scriptDir)) {
  if (!/\.(?:js|mjs)$/.test(file)) continue;
  execFileSync(process.execPath, ["--check", path.join(scriptDir, file)], { stdio: "inherit" });
}

console.log("Project validation passed.");
