# Verification Blockers

This file tracks why some targets remain `registry-seeded` instead of `converter-ready`.

Checked on April 18, 2026.

## Amp

- Public source checked: [ampcode.com](https://ampcode.com/)
- Public source checked: [ampcode.com/owner-manual](https://ampcode.com/owner-manual)
- Current blocker: the public marketing site is accessible, but the Owner's Manual redirects to a sign-in flow, so the MCP client configuration contract is not publicly verifiable from source material we can cite in this repo.
- Decision: keep `Amp` tracked, not verified.

## Replit

- Public source checked: [replit.com](https://replit.com/)
- Public source checked: public `replit/desktop` repository and code search on April 18, 2026
- Current blocker: no public, first-party MCP client configuration docs or stable config examples were found for Replit Desktop or Replit's agent surfaces.
- Decision: keep `Replit` tracked, not verified.

## Promotion Rule

A blocked target only moves to `converter-ready` after all of these are true:

- a public first-party config source exists
- the config shape is specific enough to implement or verify a formatter
- at least one real provider fixture converts through that target path
