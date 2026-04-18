# Verification Blockers

This file tracks why some targets remain `registry-seeded` instead of `converter-ready`.

Checked on April 18, 2026.

## Replit

- Public source checked: [replit.com](https://replit.com/)
- Public source checked: public `replit/desktop` repository and code search on April 18, 2026
- Public source checked: [replit/replit-gemini-extension](https://github.com/replit/replit-gemini-extension)
- Current blocker: Replit's only clear public MCP artifact is a Gemini CLI extension manifest that points at a Replit MCP server. That is evidence for Replit as an MCP provider, but not for Replit as a standalone MCP client with a user-managed config surface we can convert to.
- Decision: keep `Replit` tracked, not verified.

## Promotion Rule

A blocked target only moves to `converter-ready` after all of these are true:

- a public first-party config source exists
- the config shape is specific enough to implement or verify a formatter
- at least one real provider fixture converts through that target path
