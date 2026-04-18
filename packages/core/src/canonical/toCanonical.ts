import type { CanonicalServer, CanonicalSnippet } from "../types/canonical.js";
import type { ParsedSnippet } from "../parsers/parseSupportedInput.js";

export function toCanonical(parsed: ParsedSnippet): CanonicalSnippet {
  const servers: CanonicalServer[] = Object.entries(parsed.mcpServers).map(
    ([id, server]) => {
      if (server.command) {
        return {
          id,
          sourceFormat: "json-mcpServers",
          inferredMcpType: "local-stdio",
          transport: {
            type: "stdio",
            command: server.command,
            args: server.args ?? []
          },
          env: server.env ?? {},
          notes: []
        };
      }

      return {
        id,
        sourceFormat: "json-mcpServers",
        inferredMcpType: "hosted-remote",
        transport: {
          type: "http",
          url: server.url!,
          headers: server.headers ?? {}
        },
        env: server.env ?? {},
        notes: []
      };
    }
  );

  return { servers };
}
