import { getTool } from "../registry/loadRegistry.js";
import { UnsupportedTargetToolError } from "../errors/index.js";
import type { CanonicalSnippet } from "../types/canonical.js";

export function formatForTool(canonical: CanonicalSnippet, toolId: string): string {
  const tool = getTool(toolId);

  if (!tool) {
    throw new UnsupportedTargetToolError(toolId);
  }

  if (tool.configFamily !== "json-mcpServers") {
    throw new UnsupportedTargetToolError(
      toolId,
      `This tool uses config family ${tool.configFamily}, but only json-mcpServers formatting is implemented right now.`
    );
  }

  const mcpServers = Object.fromEntries(
    canonical.servers.map((server) => {
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
