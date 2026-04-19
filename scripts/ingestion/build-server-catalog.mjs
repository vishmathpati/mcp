import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const rawCursorFile = path.join(
  repoRoot,
  "data",
  "raw",
  "sources",
  "cursor-directory",
  "mcp-popular.json"
);
const outputFile = path.join(repoRoot, "data", "clean", "catalogs", "top-mcp-servers.json");

mkdirSync(path.dirname(outputFile), { recursive: true });

const raw = readJson(rawCursorFile);
const entries = raw.entries.map((entry) => ({
  id: entry.candidateId,
  name: entry.name,
  source: "cursor-directory",
  discoveryUrl: entry.pluginUrl,
  description: entry.description,
  verificationStatus: "discovered"
}));

writeJson(outputFile, {
  generatedAt: new Date().toISOString(),
  strategy: "cursor-directory-first",
  totalCandidates: entries.length,
  entries
});

console.log(`Built server catalog: ${path.relative(repoRoot, outputFile)}`);

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
