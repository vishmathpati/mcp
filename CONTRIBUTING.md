# Contributing

Thanks for contributing to MCP Converter.

## What We Care About

- real provider fixtures over invented examples
- explicit support claims over vague compatibility claims
- small, reviewable changes
- loud failures instead of silent bad conversion

## Before You Open A PR

1. Add or update fixtures when behavior changes.
2. Update the registry entry if a tool or provider claim changes.
3. Update [docs/support-matrix.md](/Users/vishmathpati/Arel%20OS/Projects/active/%20mcp%20converter/docs/support-matrix.md) if support levels change.
4. Run:

```bash
npm test
npm run typecheck
npm run build
```

## Support Levels

- `converter-ready`: formatter exists, tested, and backed by official docs
- `registry-seeded`: tracked in the source of truth, not fully verified yet
- `planned`: known target, not implemented

Do not move a target to `converter-ready` unless you have:

- an official source
- a tested config shape
- at least one real fixture
- clear warnings or failure behavior for unsupported cases

## Adding A New Tool

1. Add a registry file under `data/registry/tools/`.
2. Point `sourceReference` at an official doc or repo page.
3. Decide the correct `configFamily`.
4. If the family is already supported, add tests.
5. If the family is new, add formatter support first, then tests.

## Adding A New Provider Fixture

1. Add a provider entry under `data/registry/providers/` if needed.
2. Save the real source snippet under `data/fixtures/<provider>/<source-tool>/source.txt`.
3. Add a short README beside the fixture explaining where it came from.
4. Add or update conversion tests.

## Scope Discipline

This repo is not trying to parse arbitrary prose or scrape docs live during conversion.
If input is ambiguous, the correct behavior is to fail clearly.
