# Support Matrix

This file is the human-readable view of the repo-owned source of truth.

## Tool Coverage

### Verified now

- Amazon Q CLI
- Augment Code
- Claude Code
- Claude Desktop
- Cline
- Continue
- OpenAI Codex
- OpenCode
- Cursor
- Roo Code
- VS Code GitHub Copilot
- Windsurf
- Zed
- Warp

### Tracked next

- Amp
- Replit

### Planned

- T3 Chat

## Provider Coverage

- Cloudflare
- GitHub
- Hostinger
- Notion
- Stripe
- Supabase
- Vercel

## MCP Transport Types

- Local stdio
- Hosted remote HTTP
- Streamable HTTP

Auth is tracked separately from transport. Current provider auth modes in the registry include `env`, `oauth`, and `hosted-login`.

## Trust Model

- `verified now` means the formatter path is intended to work in the current converter scaffold.
- `tracked next` means the tool is already part of the registry and UI surface, but still needs fixture-backed verification against official docs.
- `planned` means the repo knows the tool exists, but we are not claiming conversion support yet.
- Some tracked tools may still use a different config family than `mcpServers`. Those stay tracked until their formatter exists and is tested.

## Fixture Rule

Nothing moves from `tracked next` to `verified now` without:

- at least one real provider fixture
- a passing parser test
- a passing conversion test
- explicit manual-step and warning behavior where needed
