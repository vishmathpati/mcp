import { getTool } from "../registry/loadRegistry.js";
import { UnsupportedTargetToolError } from "../errors/index.js";
import type { CanonicalSnippet } from "../types/canonical.js";

export function formatForTool(canonical: CanonicalSnippet, toolId: string): string {
  const tool = getTool(toolId);

  if (!tool) {
    throw new UnsupportedTargetToolError(toolId);
  }

  if (tool.configFamily === "opencode-mcp") {
    const mcp = Object.fromEntries(
      canonical.servers.map((server) => {
        if (server.transport.type === "stdio") {
          return [
            server.id,
            {
              type: "local",
              command: [server.transport.command, ...server.transport.args],
              enabled: true,
              environment:
                Object.keys(server.env).length > 0 ? server.env : undefined
            }
          ];
        }

        return [
          server.id,
          {
            type: "remote",
            url: server.transport.url,
            enabled: true,
            headers:
              Object.keys(server.transport.headers).length > 0
                ? server.transport.headers
                : undefined
          }
        ];
      })
    );

    return JSON.stringify(
      {
        $schema: "https://opencode.ai/config.json",
        mcp
      },
      null,
      2
    );
  }

  if (tool.configFamily === "zed-context-servers") {
    const context_servers = Object.fromEntries(
      canonical.servers.map((server) => {
        if (server.transport.type === "stdio") {
          return [
            server.id,
            {
              command: server.transport.command,
              args: server.transport.args,
              env: Object.keys(server.env).length > 0 ? server.env : undefined
            }
          ];
        }

        return [
          server.id,
          {
            url: server.transport.url,
            headers:
              Object.keys(server.transport.headers).length > 0
                ? server.transport.headers
                : undefined
          }
        ];
      })
    );

    return JSON.stringify({ context_servers }, null, 2);
  }

  if (tool.configFamily !== "json-mcpServers") {
    throw new UnsupportedTargetToolError(
      toolId,
      `This tool uses config family ${tool.configFamily}, but no formatter is implemented for it right now.`
    );
  }

  const mcpServers = Object.fromEntries(
    canonical.servers.map((server) => {
      if (toolId === "cline") {
        if (server.transport.type === "stdio") {
          return [
            server.id,
            {
              type: "stdio",
              command: server.transport.command,
              args: server.transport.args,
              env: Object.keys(server.env).length > 0 ? server.env : undefined,
              disabled: false
            }
          ];
        }

        return [
          server.id,
          {
            type: "streamableHttp",
            url: server.transport.url,
            headers:
              Object.keys(server.transport.headers).length > 0
                ? server.transport.headers
                : undefined,
            disabled: false
          }
        ];
      }

      if (server.transport.type === "stdio") {
        return [
          server.id,
          {
            command: server.transport.command,
            args: server.transport.args,
            env: server.env
          }
        ];
      }

      if (toolId === "amazon-q-cli") {
        return [
          server.id,
          {
            type: "http",
            url: server.transport.url,
            headers:
              Object.keys(server.transport.headers).length > 0
                ? server.transport.headers
                : undefined
          }
        ];
      }

      if (toolId === "roo-code") {
        return [
          server.id,
          {
            type: "streamable-http",
            url: server.transport.url,
            headers:
              Object.keys(server.transport.headers).length > 0
                ? server.transport.headers
                : undefined
          }
        ];
      }

      if (toolId === "windsurf") {
        return [
          server.id,
          {
            serverUrl: server.transport.url,
            headers:
              Object.keys(server.transport.headers).length > 0
                ? server.transport.headers
                : undefined
          }
        ];
      }

      return [
        server.id,
        {
          url: server.transport.url,
          headers:
            Object.keys(server.transport.headers).length > 0
              ? server.transport.headers
              : undefined
        }
      ];
    })
  );

  return JSON.stringify({ mcpServers }, null, 2);
}
