# Discovery Strategy

This repo should not guess which MCP servers matter.

Use discovery sources to find candidates, then use the official registry and first-party docs for
truth and verification.

## Source order

1. `Cursor Directory`
   Use this first to find a broad public list of MCP servers.
   Do not copy its install or marketplace metadata into our product schema.

2. `Official MCP Registry`
   Use this for canonical server metadata:
   names, versions, package locations, remote URLs, and installation metadata.

3. `Other directories`
   Use sources like `mcp.so`, `MCP.Directory`, `Glama`, and `Smithery` for enrichment only.
   They are useful for discovery, cross-checking, and missing entries, but they are not the final truth.

4. `First-party docs and repos`
   Use these to verify what we actually publish in the runtime registry and fixtures.

## How the pipeline works

1. Pull a candidate list from Cursor Directory.
2. Save that raw list into `data/raw/sources/`.
3. Build a clean candidate catalog in `data/clean/catalogs/`.
4. Cross-check candidates against the official registry.
5. Pull first-party docs for the servers we want to publish.
6. Promote reviewed records into:
   - `data/registry/providers/*.json`
   - `data/fixtures/*`
   - `data/verification/providers/*.json`

## Why this split exists

- Directories are good at discovery.
- The official registry is good at structured metadata.
- First-party docs are good at verification.
- The repo must stay deterministic, so runtime behavior only uses committed local data.

## Current first source

As of `2026-04-19`, the first popularity source is:

- [Cursor Directory MCP plugins](https://cursor.directory/plugins?tag=mcp)

This page currently gives a clean public MCP list that we can use as a first discovery source.

## Minimal candidate schema

Discovery data should stay small.

Each candidate record should only keep:

- `id`
- `name`
- `source`
- `discoveryUrl`
- `description`
- `verificationStatus`

Anything else belongs in external sources, not our runtime-facing data model.
