import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const fail = (message) => { throw new Error(message); };

const elementIndex = readJson("data/elements-index.json");
if (!Array.isArray(elementIndex) || elementIndex.length !== 118) fail("data/elements-index.json must contain exactly 118 elements.");

const atomicNumbers = elementIndex.map((element) => element.atomic_number);
if (atomicNumbers.some((number, index) => number !== index + 1)) fail("Element atomic numbers must be consecutive from 1 to 118.");

const symbols = new Set();
const names = new Set();
for (const [index, element] of elementIndex.entries()) {
  if (!element || !Number.isInteger(element.atomic_number) || typeof element.symbol !== "string" || typeof element.name !== "string" || typeof element.persian_name !== "string") {
    fail(`Invalid element index record at position ${index + 1}.`);
  }
  if (!element.symbol.trim() || !element.name.trim() || !element.persian_name.trim()) fail(`Empty element field at atomic number ${element.atomic_number}.`);
  if (symbols.has(element.symbol) || names.has(element.name)) fail(`Duplicate element symbol or name at atomic number ${element.atomic_number}.`);
  symbols.add(element.symbol);
  names.add(element.name);
}

const fa = readJson("locales/fa.json");
const en = readJson("locales/en.json");
const faKeys = Object.keys(fa).sort();
const enKeys = Object.keys(en).sort();
if (JSON.stringify(faKeys) !== JSON.stringify(enKeys)) fail("fa.json and en.json must expose the same translation keys.");
for (const key of faKeys) {
  if (typeof fa[key] !== "string" || typeof en[key] !== "string") fail(`Locale values must be strings: ${key}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const i18nKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
const ariaKeys = [...html.matchAll(/data-i18n-aria-label="([^"]+)"/g)].map((match) => match[1]);
for (const key of [...new Set([...i18nKeys, ...ariaKeys])]) {
  if (!(key in fa) || !(key in en)) fail(`HTML references missing locale key: ${key}`);
}
if (!html.includes('rel="canonical"') || !html.includes('rel="icon"')) fail("index.html must expose canonical URL and site icon.");

const metadata = readJson("data/periodic-table-meta.json");
if (!metadata || metadata.schema_version !== "periodic-table-meta-v1" || metadata.element_count !== 118 || !Array.isArray(metadata.elements) || metadata.elements.length !== 118) {
  fail("periodic-table-meta.json must contain exactly 118 metadata records.");
}
const categories = new Set(["alkali", "alkaline", "transition", "postTransition", "metalloid", "nonmetal", "halogen", "noble", "lanthanide", "actinide"]);
const metadataNumbers = new Set();
for (const item of metadata.elements) {
  if (!Number.isInteger(item.atomic_number) || item.atomic_number < 1 || item.atomic_number > 118) fail("Invalid metadata atomic number.");
  if (metadataNumbers.has(item.atomic_number)) fail(`Duplicate metadata atomic number: ${item.atomic_number}`);
  metadataNumbers.add(item.atomic_number);
  if (!categories.has(item.category) || !Number.isInteger(item.row) || !Number.isInteger(item.column)) fail(`Invalid periodic metadata at atomic number ${item.atomic_number}`);
}
if (metadataNumbers.size !== 118) fail("Periodic table metadata must cover all 118 atomic numbers.");

const manifest = readJson("data/raw-elements-manifest.json");
if (manifest.schema_version !== "raw-element-manifest-v1" || manifest.element_count !== 118 || !Array.isArray(manifest.files) || manifest.files.length !== 118) {
  fail("raw-elements-manifest.json must contain exactly 118 files.");
}
for (const [index, file] of manifest.files.entries()) {
  const expected = `data/ELEMENT_ATOMIC NUMBER_${index + 1}.json`;
  if (file !== expected || !fs.existsSync(path.join(root, file))) fail(`Invalid raw element manifest entry: ${file}`);
}

const dataDir = path.join(root, "data");
const rawFiles = fs.readdirSync(dataDir).filter((name) => /^ELEMENT_ATOMIC NUMBER_\d+\.json$/.test(name));
if (rawFiles.length !== 118) fail(`Expected 118 raw element files, found ${rawFiles.length}.`);
const rawNumbers = new Set();
for (const file of rawFiles) {
  const atomicNumber = Number(file.match(/(\d+)/)[1]);
  if (rawNumbers.has(atomicNumber)) fail(`Duplicate raw element file: ${atomicNumber}`);
  const raw = readJson(path.join("data", file));
  if (!raw?.Record || raw.Record.RecordNumber !== atomicNumber) fail(`Raw element mismatch: ${file}`);
  rawNumbers.add(atomicNumber);
}
if (rawNumbers.size !== 118) fail("Raw element files must cover atomic numbers 1 through 118.");

const scriptDir = path.join(root, "scripts");
for (const file of fs.readdirSync(scriptDir)) {
  if (!/\.(?:js|mjs)$/.test(file)) continue;
  execFileSync(process.execPath, ["--check", path.join(scriptDir, file)], { stdio: "inherit" });
}

console.log("Project validation passed.");