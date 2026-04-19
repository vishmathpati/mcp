import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const rawProvidersDir = path.join(repoRoot, "data", "raw", "providers");
const cleanProvidersDir = path.join(repoRoot, "data", "clean", "providers");
const verificationProvidersDir = path.join(repoRoot, "data", "verification", "providers");
const registryProvidersDir = path.join(repoRoot, "data", "registry", "providers");
const fixturesDir = path.join(repoRoot, "data", "fixtures");

mkdirSync(cleanProvidersDir, { recursive: true });
mkdirSync(verificationProvidersDir, { recursive: true });

const args = process.argv.slice(2);
const syncAll = args.includes("--all");
const providerIds = syncAll ? listRawProviderIds() : args.filter((arg) => !arg.startsWith("--"));

if (providerIds.length === 0) {
  console.error("Usage: node scripts/ingestion/sync-provider.mjs <provider-id> [provider-id...]");
  console.error("   or: node scripts/ingestion/sync-provider.mjs --all");
  process.exit(1);
}

for (const providerId of providerIds) {
  syncProvider(providerId);
  console.log(`Synced provider: ${providerId}`);
}

function listRawProviderIds() {
  if (!existsSync(rawProvidersDir)) {
    return [];
  }

  return readdirSync(rawProvidersDir).filter((entry) =>
    existsSync(path.join(rawProvidersDir, entry, "firecrawl-mcp.json"))
  );
}

function syncProvider(providerId) {
  const rawFilePath = path.join(rawProvidersDir, providerId, "firecrawl-mcp.json");

  if (!existsSync(rawFilePath)) {
    throw new Error(`Missing raw provider file: ${rawFilePath}`);
  }

  const rawRecord = readJson(rawFilePath);
  const registryFilePath = path.join(registryProvidersDir, `${providerId}.json`);
  const registryRecord = existsSync(registryFilePath) ? readJson(registryFilePath) : null;
  const fixtureExists = existsSync(path.join(fixturesDir, providerId));

  const cleanRecord = buildCleanRecord(providerId, rawRecord, registryRecord);
  const verificationRecord = buildVerificationRecord(
    providerId,
    rawRecord,
    registryRecord,
    fixtureExists
  );

  writeJson(path.join(cleanProvidersDir, `${providerId}.json`), cleanRecord);
  writeJson(path.join(verificationProvidersDir, `${providerId}.json`), verificationRecord);
}

function buildCleanRecord(providerId, rawRecord, registryRecord) {
  const extracted = rawRecord.rawExtract ?? {};
  const docsReference =
    normalizeUrl(rawRecord.resolvedDocsUrl) ??
    normalizeUrl(extracted.docsUrl) ??
    registryRecord?.docsReference ??
    rawRecord.sourceUrl;

  const remoteEndpoints = uniqueStrings(extracted.remoteUrls);
  const exampleClientsMentioned = uniqueStrings(extracted.mentionedClients);
  const sourceNotes = uniqueStrings(extracted.authNotes);
  const registryNotes = uniqueStrings(registryRecord?.notes);

  return {
    id: providerId,
    displayName: extracted.providerName ?? registryRecord?.displayName ?? providerId,
    homepage:
      registryRecord?.homepage ??
      inferHomepage(rawRecord.sourceUrl, docsReference) ??
      rawRecord.sourceUrl,
    docsReference,
    authMode: registryRecord?.authMode ?? inferAuthMode(sourceNotes),
    knownMcpTypes: registryRecord?.knownMcpTypes ?? inferMcpTypes(remoteEndpoints, sourceNotes),
    knownSourceFormats: registryRecord?.knownSourceFormats ?? ["json-mcpServers"],
    remoteEndpoints,
    exampleClientsMentioned,
    notes: uniqueStrings([
      ...registryNotes,
      ...sourceNotes,
      ...rawRecord.collectionNotes
    ]),
    source: {
      collectedFrom: rawRecord.collector ?? "unknown",
      collectedAt: rawRecord.collectedAt ?? today(),
      sourceUrl: rawRecord.sourceUrl
    }
  };
}

function buildVerificationRecord(providerId, rawRecord, registryRecord, fixtureExists) {
  const docsReference =
    normalizeUrl(rawRecord.resolvedDocsUrl) ??
    normalizeUrl(rawRecord.rawExtract?.docsUrl) ??
    registryRecord?.docsReference ??
    rawRecord.sourceUrl;

  const published = Boolean(registryRecord);
  const verified = Boolean(registryRecord && fixtureExists);

  return {
    providerId,
    checkedAt: today(),
    pipelineStatus: {
      discovered: true,
      scraped: true,
      cleaned: true,
      verified,
      published,
      blocked: false
    },
    evidence: {
      primaryDoc: docsReference,
      rawPath: path.relative(repoRoot, path.join(rawProvidersDir, providerId, "firecrawl-mcp.json")),
      cleanPath: path.relative(repoRoot, path.join(cleanProvidersDir, `${providerId}.json`)),
      fixturePath: fixtureExists
        ? path.relative(repoRoot, path.join(fixturesDir, providerId))
        : null,
      registryPath: published
        ? path.relative(repoRoot, path.join(registryProvidersDir, `${providerId}.json`))
        : null
    },
    verificationNotes: buildVerificationNotes(registryRecord, fixtureExists, rawRecord)
  };
}

function buildVerificationNotes(registryRecord, fixtureExists, rawRecord) {
  const notes = [];

  if (registryRecord) {
    notes.push("Provider exists in the committed runtime registry.");
  } else {
    notes.push("Provider is not yet in the committed runtime registry.");
  }

  if (fixtureExists) {
    notes.push("At least one fixture directory exists for this provider.");
  } else {
    notes.push("No fixture directory exists yet for this provider.");
  }

  if (rawRecord.rawExtract?.summary) {
    notes.push(rawRecord.rawExtract.summary);
  }

  return uniqueStrings(notes);
}

function inferHomepage(sourceUrl, docsReference) {
  const preferred = normalizeUrl(sourceUrl) ?? normalizeUrl(docsReference);

  if (!preferred) {
    return null;
  }

  try {
    const url = new URL(preferred);
    return `${url.protocol}//${url.hostname}/`;
  } catch {
    return preferred;
  }
}

function inferAuthMode(notes) {
  const text = notes.join(" ").toLowerCase();

  if (text.includes("browser") || text.includes("dynamic client registration")) {
    return "hosted-login";
  }

  if (text.includes("oauth")) {
    return "oauth";
  }

  if (text.includes("token") || text.includes("authorization header")) {
    return "env";
  }

  return "mixed";
}

function inferMcpTypes(remoteEndpoints, notes) {
  const lowerNotes = notes.join(" ").toLowerCase();
  const types = new Set();

  if (remoteEndpoints.some((endpoint) => endpoint.startsWith("http://localhost"))) {
    types.add("local-stdio");
  }

  if (remoteEndpoints.some((endpoint) => endpoint.startsWith("https://"))) {
    types.add("hosted-remote");
  }

  if (lowerNotes.includes("streamable") || lowerNotes.includes("http")) {
    types.add("streamable-http");
  }

  return Array.from(types.size > 0 ? types : new Set(["hosted-remote"]));
}

function uniqueStrings(values) {
  return Array.from(
    new Set(
      (values ?? [])
        .filter((value) => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function normalizeUrl(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
