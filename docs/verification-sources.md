# Verification Sources

This file tracks the primary sources used to move tools from `registry-seeded` to `converter-ready`.

## Verified Clients

| Tool | Primary source | Notes |
| --- | --- | --- |
| Amazon Q CLI | https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/qdev-mcp.html | Official docs show `mcpServers` plus remote `type: "http"` support. |
| Augment Code | https://docs.augmentcode.com/cli/integrations | Official Auggie docs cover `~/.augment/settings.json`, `mcpServers`, and explicit remote `http`/`sse` transport types. |
| Claude Code | https://docs.anthropic.com/en/docs/claude-code/mcp | Source-format baseline used by current fixtures and parser coverage. |
| Claude Desktop | https://modelcontextprotocol.io/quickstart/user | Shared `mcpServers` family coverage, kept visible as a supported target. |
| Cline | https://github.com/cline/cline/blob/main/docs/mcp/adding-and-configuring-servers.mdx | Official repo docs plus schema files confirm `stdio`, `streamableHttp`, and `sse`. |
| Continue | https://docs.continue.dev/customize/deep-dives/mcp | Official docs confirm JSON config compatibility with Claude/Cursor/Cline-style MCP files. |
| Cursor | https://docs.cursor.com/context/model-context-protocol | Official docs confirm local and remote MCP support in `mcpServers` config. |
| OpenAI Codex | https://platform.openai.com/docs/codex/mcp | Official docs for Codex MCP configuration shape. |
| OpenCode | https://opencode.ai/docs/mcp-servers/ | Uses a distinct `opencode.json` config with a top-level `mcp` block. |
| Roo Code | https://docs.roocode.com/features/mcp/using-mcp-in-roo | Official docs cover global `mcp_settings.json`, project `.roo/mcp.json`, and explicit remote transport types. |
| VS Code GitHub Copilot | https://code.visualstudio.com/docs/copilot/chat/mcp-servers | Official docs cover MCP server configuration in VS Code. |
| Warp | https://docs.warp.dev/agent-platform/warp-agents/mcp | Official docs cover pasted `mcpServers` snippets plus CLI and URL server shapes. |
| Windsurf | https://docs.windsurf.com/windsurf/cascade/mcp | Official docs cover `~/.codeium/windsurf/mcp_config.json`, `mcpServers`, and remote `serverUrl`. |
| Zed | https://zed.dev/docs/ai/mcp | Official docs cover `context_servers` with local `command/args/env` and remote `url/headers`. |

## Verification Rule

Nothing should move to `converter-ready` until all of these are true:

- an official or primary-source config doc is linked here
- at least one real provider fixture converts successfully
- formatter output is covered by a passing test
- any lossy or tool-specific default is documented in code or warnings
