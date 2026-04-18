import { UnsupportedMcpTypeError, UnsupportedTargetToolError } from "../errors/index.js";
import { getTool } from "../registry/loadRegistry.js";
import type { CanonicalSnippet, CompatibilityWarning } from "../types/canonical.js";

export function assessCompatibility(
  canonical: CanonicalSnippet,
  toolId: string
): CompatibilityWarning[] {
  const tool = getTool(toolId);

  if (!tool) {
    throw new UnsupportedTargetToolError(toolId);
  }

  const warnings: CompatibilityWarning[] = [];

  if (tool.supportLevel !== "converter-ready") {
    warnings.push({
      code: "registry-seeded-target",
      message:
        "This target is tracked in the registry, but its formatter behavior is still being verified against official docs."
    });
  }

  for (const server of canonical.servers) {
    if (!tool.supportedMcpTypes.includes(server.inferredMcpType)) {
      throw new UnsupportedMcpTypeError(
        `Tool ${toolId} does not support MCP type ${server.inferredMcpType}.`
      );
    }

    if (server.transport.type === "http" && Object.keys(server.env).length > 0) {
      warnings.push({
        code: "env-plus-http",
        message:
          "This server includes environment variables alongside remote transport. Review manual setup notes before use."
      });
    }

    if (toolId === "cline" && server.transport.type === "http") {
      warnings.push({
        code: "cline-remote-default",
        message:
          "Cline remote servers require an explicit transport type. This conversion defaults to streamableHttp; switch to sse if the provider requires legacy SSE."
      });
    }
  }

  return warnings;
}
