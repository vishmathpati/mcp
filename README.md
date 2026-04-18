# MCP Converter

Open-source MCP compatibility tooling.

This repo is building the first release of a deterministic MCP converter:

- paste a supported MCP snippet
- choose a supported target tool
- get a converted config
- see what changed, what is unsupported, and what still needs manual setup

This release is backed by:

- repo-owned source-of-truth rules
- typed schemas
- real provider fixtures from official docs
- loud failure on unknown input

Current scaffold breadth:

- 17 tracked target tools
- 6 verified formatter targets
- 7 seeded providers
- 3 MCP transport types

## Current Scope

Converter release only.

Not in scope yet:

- SEO landing pages
- hosted-auth explainer pages
- CLI config patcher
- generic MCP directory
- live scraping during conversion

## Project Shape

```text
apps/
  web/
packages/
  core/
data/
  registry/
  fixtures/
```

## Support Levels

This repo tracks tools in three levels:

- `converter-ready`: release-1 target, supported by tests and formatters
- `registry-seeded`: tracked in the source of truth, not guaranteed in release 1
- `planned`: known target, schema placeholder only

See [docs/support-matrix.md](/Users/vishmathpati/Arel%20OS/Projects/active/%20mcp%20converter/docs/support-matrix.md) for the current support inventory.

## Real Provider Fixtures

The repo already includes first fixtures sourced from official docs:

- Supabase MCP docs
- Hostinger MCP docs

Each fixture is versioned and testable. If a provider changes its snippet shape, the fix starts with a new failing fixture.

## Registry Layout

The repo-owned source of truth lives in:

- `data/registry/tools/*.json`
- `data/registry/providers/*.json`
- `data/registry/mcp-types/*.json`
- `data/fixtures/<provider>/<source-tool>/`

The app does not scrape docs live during conversion. It uses the committed registry, validates it at load time, and only converts supported shapes.

Some tracked tools already have official MCP docs but use a different config family than the current formatter. Those stay visible in the registry, but they do not get promoted until their formatter exists.

## Development

```bash
npm install
npm test
npm run dev
```
