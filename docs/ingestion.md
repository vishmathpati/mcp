# Ingestion Flow

This repo keeps scraped MCP provider data separate from the runtime registry.

## Layers

- `data/raw/providers/*/firecrawl-mcp.json`
  Firecrawl-collected source material. Keep the original scrape facts here.
- `data/raw/sources/*`
  Discovery-source snapshots such as Cursor Directory candidate lists.
- `data/clean/providers/*.json`
  Normalized provider records derived from raw collection.
- `data/clean/catalogs/*.json`
  Clean candidate lists used to decide which servers we should ingest next.
- `data/verification/providers/*.json`
  Pipeline status for each provider: discovered, scraped, cleaned, verified, published, blocked.
- `data/registry/providers/*.json`
  Runtime source of truth used by the converter app.

## Commands

Sync one provider from raw to clean + verification:

```bash
npm run ingest:sync -- supabase
```

Sync every raw provider:

```bash
npm run ingest:sync -- --all
```

Generate the provider status index:

```bash
npm run ingest:index
```

Build the first candidate catalog from Cursor Directory:

```bash
npm run ingest:catalog
```

## Promotion Rule

Raw collection does not change runtime behavior.

A provider should only move into `data/registry/providers/*.json` after:

- docs were collected and cleaned
- at least one real fixture exists
- the verification file says `verified: true`
- a human reviewed the record

## Discovery source rule

Use discovery sources like Cursor Directory to decide what to ingest first.

Do not publish runtime support directly from those sources.
Cross-check candidates against the official registry and first-party docs first.
