import type { CanonicalSnippet, CompatibilityWarning } from "../types/canonical.js";

export function buildExplanation(
  canonical: CanonicalSnippet,
  toolId: string,
  warnings: CompatibilityWarning[]
) {
  return {
    changed: [
      `Prepared output for target tool: ${toolId}.`,
      `Normalized ${canonical.servers.length} MCP server definition(s).`
    ],
    unchanged: ["Server identity and transport intent were preserved where supported."],
    manualSteps: [
      "Review warnings before copying the generated config.",
      "Complete any required browser or terminal authentication flow after adding the config."
    ],
    warnings
  };
}
