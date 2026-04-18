import { cleanInput } from "./input/cleanInput.js";
import { parseSupportedInput } from "./parsers/parseSupportedInput.js";
import { toCanonical } from "./canonical/toCanonical.js";
import { assessCompatibility } from "./compatibility/assessCompatibility.js";
import { formatForTool } from "./formatters/formatForTool.js";
import { buildExplanation } from "./explanations/buildExplanation.js";
import type { ConversionResult } from "./types/canonical.js";

export function convertSnippet(rawInput: string, targetToolId: string): ConversionResult {
  const cleaned = cleanInput(rawInput);
  const parsed = parseSupportedInput(cleaned);
  const canonical = toCanonical(parsed);
  const warnings = assessCompatibility(canonical, targetToolId);
  const output = formatForTool(canonical, targetToolId);
  const explanation = buildExplanation(canonical, targetToolId, warnings);

  return {
    toolId: targetToolId,
    output,
    warnings,
    explanation
  };
}

export * from "./errors/index.js";
export * from "./registry/loadRegistry.js";
export type * from "./types/canonical.js";
export type * from "./types/registry.js";
