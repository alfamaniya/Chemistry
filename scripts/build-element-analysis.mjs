import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");
const outputDir = path.join(dataDir, "analyzed");
const outputFile = path.join(outputDir, "elements-analysis.json");
const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, "raw-elements-manifest.json"), "utf8"));

if (manifest.schema_version !== "raw-element-manifest-v1" || manifest.element_count !== 118 || !Array.isArray(manifest.files) || manifest.files.length !== 118) {
  throw new Error("Invalid raw-elements-manifest.json");
}

fs.mkdirSync(outputDir, { recursive: true });

function walkInformation(section, result) {
  if (!section || typeof section !== "object") return;
  if (Array.isArray(section.Information)) {
    result.propertyCount += section.Information.length;
    for (const item of section.Information) {
      if (item && (item.Reference || item.ExtendedReference || item.URL)) result.hasReferences = true;
    }
  }
  if (section.URL || section.Reference || section.ExtendedReference) result.hasReferences = true;
  if (Array.isArray(section.Section)) {
    for (const child of section.Section) walkInformation(child, result);
  }
}

const files = [...manifest.files].sort((a, b) => {
  const na = Number(a.match(/(\d+)/)[1]);
  const nb = Number(b.match(/(\d+)/)[1]);
  return na - nb;
});

const elements = files.map((file) => {
  const atomicNumber = Number(file.match(/(\d+)/)[1]);
  const sourcePath = path.join(dataDir, file);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing raw element file: ${file}`);
  const raw = fs.readFileSync(sourcePath, "utf8");
  const json = JSON.parse(raw);
  const record = json.Record ?? {};
  if (record.RecordNumber !== atomicNumber) throw new Error(`Raw record mismatch: ${file}`);

  const analysis = { propertyCount: 0, hasReferences: false };
  const sections = Array.isArray(record.Section) ? record.Section : [];
  for (const section of sections) walkInformation(section, analysis);

  return {
    atomic_number: atomicNumber,
    record_type: record.RecordType ?? null,
    record_title: record.RecordTitle ?? null,
    source_file: file,
    sections: sections.map((section) => section?.TOCHeading).filter(Boolean),
    property_count: analysis.propertyCount,
    has_references: analysis.hasReferences,
    source_size_bytes: Buffer.byteLength(raw, "utf8")
  };
});

if (elements.length !== 118) throw new Error(`Expected 118 element files, found ${elements.length}.`);

fs.writeFileSync(
  outputFile,
  JSON.stringify({
    schema_version: "element-analysis-v1",
    generated_by: "scripts/build-element-analysis.mjs",
    source_manifest: "data/raw-elements-manifest.json",
    element_count: elements.length,
    elements
  }, null, 2) + "\n"
);

console.log(`Analyzed ${elements.length} element files -> ${path.relative(root, outputFile)}`);