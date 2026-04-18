# Registry Source Of Truth

This folder is the committed ruleset the converter uses at runtime.

## Files

- `tools/*.json`: target tool definitions, support level, config family, supported MCP types
- `providers/*.json`: provider metadata, docs references, auth mode, known MCP types
- `mcp-types/*.json`: MCP transport categories

## Rules

- Edit the JSON here first, not the formatter code.
- Every new tool or provider entry should point at a real public source.
- `converter-ready` is reserved for targets backed by tests and real fixtures.
- `registry-seeded` is allowed for major or fast-growing tools that we want tracked before full verification.
- Runtime conversion uses this committed data only. No live scraping.
