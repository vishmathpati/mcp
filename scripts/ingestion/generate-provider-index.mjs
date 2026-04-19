import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const rawProvidersDir = path.join(repoRoot, "data", "raw", "providers");
const cleanProvidersDir = path.join(repoRoot, "data", "clean", "providers");
const verificationProvidersDir = path.join(repoRoot, "data", "verification", "providers");
const registryProvidersDir = path.join(repoRoot, "data", "registry", "providers");
const outputPath = path.join(repoRoot, "data", "verification", "provider-index.json");

mkdirSync(path.dirname(outputPath), { recursive: true });

const providerIds = new Set([
  ...listIdsFromNestedRaw(rawProvidersDir),
  ...listIdsFromFlatJson(cleanProvidersDir),
  ...listIdsFromFlatJson(verificationProvidersDir),
  ...listIdsFromFlatJson(registryProvidersDir)
]);

const providers = Array.from(providerIds)
  .sort()
  .map((providerId) => buildEntry(providerId));

const summary = {
  totalProvidersTracked: providers.length,
  discovered: providers.filter((entry) => entry.pipelineStatus.discovered).length,
  scraped: providers.filter((entry) => entry.pipelineStatus.scraped).length,
  cleaned: providers.filter((entry) => entry.pipelineStatus.cleaned).length,
  verified: providers.filter((entry) => entry.pipelineStatus.verified).length,
  published: providers.filter((entry) => entry.pipelineStatus.published).length,
  blocked: providers.filter((entry) => entry.pipelineStatus.blocked).length
};

writeFileSync(
  outputPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), summary, providers }, null, 2)}\n`,
  "utf8"
);

console.log(`Generated provider index: ${path.relative(repoRoot, outputPath)}`);

function buildEntry(providerId) {
  const rawPath = path.join(rawProvidersDir, providerId, "firecrawl-mcp.json");
  const cleanPath = path.join(cleanProvidersDir, `${providerId}.json`);
  const verificationPath = path.join(verificationProvidersDir, `${providerId}.json`);
  const registryPath = path.join(registryProvidersDir, `${providerId}.json`);

  const raw = existsSync(rawPath) ? readJson(rawPath) : null;
  const clean = existsSync(cleanPath) ? readJson(cleanPath) : null;
  const verification = existsSync(verificationPath) ? readJson(verificationPath) : null;
  const registry = existsSync(registryPath) ? readJson(registryPath) : null;

  return {
    providerId,
    displayName:
      clean?.displayName ??
      registry?.displayName ??
      raw?.rawExtract?.providerName ??
      providerId,
    pipelineStatus: verification?.pipelineStatus ?? {
      discovered: Boolean(raw),
      scraped: Boolean(raw),
      cleaned: Boolean(clean),
      verified: false,
      published: Boolean(registry),
      blocked: false
    },
    paths: {
      raw: existsSync(rawPath) ? path.relative(repoRoot, rawPath) : null,
      clean: existsSync(cleanPath) ? path.relative(repoRoot, cleanPath) : null,
      verification: existsSync(verificationPath) ? path.relative(repoRoot, verificationPath) : null,
      registry: existsSync(registryPath) ? path.relative(repoRoot, registryPath) : null
    },
    docsReference: clean?.docsReference ?? registry?.docsReference ?? raw?.resolvedDocsUrl ?? null
  };
}

function listIdsFromNestedRaw(dirPath) {
  if (!existsSync(dirPath)) {
    return [];
  }

  return readdirSync(dirPath).filter((entry) =>
    existsSync(path.join(dirPath, entry, "firecrawl-mcp.json"))
  );
}

function listIdsFromFlatJson(dirPath) {
  if (!existsSync(dirPath)) {
    return [];
  }

  return readdirSync(dirPath)
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => entry.replace(/\.json$/, ""));
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}
