# MCP Converter Release 1 Implementation Spec

Status: Draft  
Scope: Converter release only  
Out of scope: SEO pages, hosted-auth docs, CLI patcher, generic directory

## Goal

Build a trustworthy open-source web app that:
- accepts only supported MCP snippet formats
- converts them into supported target tool configs
- refuses unknown input loudly
- explains what changed, what is unsupported, and what the user must still do manually

This release is a deterministic converter backed by repo-owned rules and real fixtures. It is not an AI guesser.

## Product Rules

1. Supported inputs only.
2. Supported target tools only.
3. Source-of-truth data lives in the repo, versioned and tested.
4. Real provider fixtures are part of the product, not just test data.
5. Unknown or ambiguous input fails loudly.
6. Unsupported capability combinations must produce explicit warnings or hard failures.

## Tech Shape

One TypeScript codebase with two top-level modules:

```text
apps/
  web/
packages/
  core/
data/
  registry/
  fixtures/
docs/
  designs/
```

### Why this shape

- `packages/core` contains all conversion logic and can later power the CLI.
- `apps/web` stays thin and only handles UI and request/response wiring.
- `data/registry` keeps the source of truth explicit and reviewable.
- `data/fixtures` proves the product against real snippets.

## Folder Structure

```text
apps/
  web/
    src/
      app/
      components/
      lib/
      routes/
    tests/
      integration/
      ui/

packages/
  core/
    src/
      types/
      input/
      parsers/
      canonical/
      registry/
      compatibility/
      formatters/
      explanations/
      errors/
      index.ts
    tests/
      input/
      parsers/
      canonical/
      registry/
      compatibility/
      formatters/
      explanations/
      integration/

data/
  registry/
    tools/
      codex.json
      claude-code.json
      claude-desktop.json
      cursor.json
    mcp-types/
      local-stdio.json
      hosted-remote.json
      streamable-http.json
    providers/
      hostinger.json
      supabase.json
      ...
  fixtures/
    hostinger/
      claude-code/
        source.txt
        expected-codex.json
        expected-cursor.json
        expected-warnings.json
    supabase/
      claude-code/
        source.txt
        expected-codex.json
        expected-warnings.json
```

## Core Pipeline

```text
RAW INPUT
   |
   v
[input cleaner]
   |
   v
[supported parser]
   |
   v
[canonical model]
   |
   v
[compatibility engine]
   |             \
   |              \-> warnings / blocking errors
   v
[target formatter]
   |
   v
[explanation builder]
   |
   v
WEB RESPONSE
```

## Module Responsibilities

### `packages/core/src/input`

Purpose:
- trim whitespace
- remove markdown code fences
- normalize line endings
- reject empty input

Must not:
- infer unsupported formats
- guess provider from arbitrary prose

### `packages/core/src/parsers`

Purpose:
- parse only known snippet shapes
- return typed source objects

Files:
- `parseClaudeCode.ts`
- `parseCursor.ts`
- `parseSupportedInput.ts`

Contract:
- success returns typed parsed input
- failure returns typed parse error with reason

### `packages/core/src/canonical`

Purpose:
- convert parsed input into one internal representation

This is the internal source of truth for conversion, not the raw pasted text.

### `packages/core/src/registry`

Purpose:
- load and validate repo-owned rule files
- expose typed accessors for tools, MCP types, and providers

This module owns startup validation. If registry data is invalid, tests and app boot should fail.

### `packages/core/src/compatibility`

Purpose:
- decide whether a source snippet can be converted to a chosen target
- emit:
  - supported
  - supported with warnings
  - blocked

This module is the safety brain. It must stay separate from formatting.

### `packages/core/src/formatters`

Purpose:
- produce exact target config shape for each supported tool

Files:
- `formatCodex.ts`
- `formatClaudeCode.ts`
- `formatClaudeDesktop.ts`
- `formatCursor.ts`

Must not:
- perform compatibility checks
- silently drop unsupported capabilities

### `packages/core/src/explanations`

Purpose:
- build user-facing structured explanations:
  - what changed
  - what stayed the same
  - what is unsupported
  - what manual steps remain

### `packages/core/src/errors`

Typed error classes:
- `EmptyInputError`
- `UnsupportedInputFormatError`
- `RegistryValidationError`
- `UnsupportedTargetToolError`
- `UnsupportedMcpTypeError`
- `UnsupportedCapabilityError`
- `FormatterInvariantError`

No catch-all generic errors in product-facing flows.

## Exact Data Shapes

### Supported Tool Registry Shape

```ts
type SupportedTool = {
  id: string;
  displayName: string;
  configFormat: "json" | "jsonc" | "yaml" | "other";
  configTarget: "file" | "snippet";
  supportedMcpTypes: string[];
  supportedCapabilities: string[];
  requiredFields: string[];
  unsupportedCapabilities: string[];
  notes: string[];
};
```

Example:

```json
{
  "id": "codex",
  "displayName": "OpenAI Codex",
  "configFormat": "json",
  "configTarget": "file",
  "supportedMcpTypes": ["local-stdio", "hosted-remote", "streamable-http"],
  "supportedCapabilities": ["tools", "resources"],
  "requiredFields": ["transport", "server"],
  "unsupportedCapabilities": ["apps"],
  "notes": ["May require follow-up auth flow depending on provider."]
}
```

### MCP Type Registry Shape

```ts
type McpType = {
  id: string;
  displayName: string;
  transport: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
};
```

### Provider Registry Shape

```ts
type ProviderRule = {
  id: string;
  displayName: string;
  knownSourceFormats: string[];
  knownMcpTypes: string[];
  authMode: "none" | "env" | "oauth" | "hosted-login" | "mixed";
  notes: string[];
};
```

### Canonical Model Shape

```ts
type CanonicalMcpConfig = {
  sourceTool: string;
  providerId?: string;
  mcpType: string;
  transport: {
    type: "stdio" | "http" | "streamable-http";
    command?: string;
    args?: string[];
    url?: string;
  };
  auth: {
    mode: "none" | "env" | "oauth" | "hosted-login" | "mixed";
    envVars: string[];
  };
  server: {
    name?: string;
    description?: string;
  };
  capabilities: string[];
  rawMetadata: Record<string, unknown>;
};
```

## Web App Contract

Single-page flow for release 1:

```text
[paste input]
     |
     v
[source detected or rejected]
     |
     v
[target tool picker]
     |
     v
[convert]
     |
     +--> success output
     +--> warnings panel
     +--> explanation panel
     \--> hard failure panel
```

### Web App States

- idle
- input-invalid
- input-supported
- converting
- success
- success-with-warnings
- blocked

No hidden fallback state.

## Error Handling Rules

For every conversion request:
- empty input -> block with clear message
- unsupported input shape -> block with clear message
- unsupported target tool -> block with clear message
- unsupported capability -> either warning or block, based on rules
- invalid registry data -> fail startup/build, not user request

### Silent failure policy

Forbidden:
- partial conversion without warning
- inferred provider identity without evidence
- dropping fields without explanation

## Test Plan

### Test stack

- `vitest` for unit and integration
- optional app-route integration tests in the web app
- no browser E2E suite required for release 1 unless UI complexity expands

### Required tests by module

#### Input tests
- strips markdown code fences
- trims whitespace
- rejects empty input

#### Parser tests
- parses each supported source format
- rejects unknown shape loudly
- rejects ambiguous shape loudly

#### Canonical model tests
- normalizes each supported parser output into canonical form
- rejects missing required canonical fields

#### Registry tests
- every tool file matches schema
- every MCP type file matches schema
- every provider file matches schema
- cross-reference validation, no unknown tool/type IDs

#### Compatibility tests
- supported source -> supported target
- supported source -> supported target with warnings
- supported source -> blocked target

#### Formatter tests
- exact output snapshots or structural assertions for each target
- formatter fails if required canonical data is missing

#### Explanation tests
- success explanation
- warning explanation
- blocked explanation

#### Integration tests
- real fixture source -> parsed -> canonical -> compatibility -> formatted -> explained

### Real fixture requirement

Release 1 must ship with real copied provider examples.

Minimum:
- Hostinger
- Supabase
- 2-3 other common providers

Coverage target:
- enough providers + target tools to cover roughly 95% of common early user cases

### Regression policy

When a provider changes their snippet shape:
- add a new fixture
- write a failing test first
- fix parser/rules
- ship

## Release 1 Supported Matrix

The exact list can change, but the release must define this matrix explicitly before implementation begins:

```text
SUPPORTED TARGET TOOLS
- codex
- claude-code
- claude-desktop
- cursor
- one additional tool only if there is strong demand

SUPPORTED MCP TYPES
- local-stdio
- hosted-remote
- streamable-http
- one additional type only if it fits the same schema cleanly
```

## Milestones

### Milestone 1: Skeleton
- initialize monorepo or workspace
- add TypeScript config
- add `packages/core`
- add `apps/web`
- add `vitest`

### Milestone 2: Registry + Types
- define schemas
- add initial registry files
- add schema validation tests

### Milestone 3: Parser + Canonical Model
- build input cleaner
- build supported parsers
- build canonical model mapping
- add unit tests

### Milestone 4: Compatibility + Formatting
- build compatibility engine
- build target formatters
- add warning/block behavior
- add integration tests

### Milestone 5: Real Fixtures
- collect real provider snippets
- commit fixtures
- add fixture-driven tests

### Milestone 6: Web UI
- build paste form
- add target tool picker
- render output, warnings, explanations
- add web integration tests

### Milestone 7: Hardening
- tighten errors
- improve messages
- finalize README examples
- prepare open-source contribution path

## Parallelization Strategy

```text
Lane A: registry schemas -> initial registry files -> registry tests
Lane B: input cleaner -> parsers -> canonical model
Lane C: web shell and UI states

Then:
Lane D: compatibility engine + formatters

Then:
Lane E: real fixtures + integration tests

Then:
Lane F: final UI wiring to core outputs
```

Launch A + B + C in parallel.  
Merge them.  
Then D.  
Then E.  
Then F.

Potential conflict:
- Lane B and D both touch `packages/core`, so D should wait for B.

## NOT in Scope

- Programmatic SEO pages
  Reason: separate product surface, separate rollout, not needed for converter trust

- Hosted-auth explainer docs
  Reason: useful follow-on content, but not required to make the converter work

- CLI config patcher
  Reason: same core can power it later, but file mutation raises risk and should follow a stable rules engine

- Generic MCP directory
  Reason: low-trust commodity surface, not the core differentiator

- Live scraping during conversion
  Reason: makes outputs non-deterministic and hard to test

## README Requirements

The repo README should show:
- supported tools
- supported MCP types
- example real providers covered
- explicit non-goals
- how to add a provider fixture
- how to add a new supported tool

## Definition of Done

Release 1 is done when:
- a user can paste a supported real snippet
- choose a supported target tool
- get deterministic output
- see explicit warnings or blocking errors
- and every supported path is backed by committed fixtures and tests
