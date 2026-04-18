import { RegistryValidationError } from "../errors/index.js";
import {
  McpTypeSchema,
  ProviderRegistrySchema,
  ToolRegistrySchema
} from "./schemas.js";
import {
  defaultMcpTypes,
  defaultProviderRegistry,
  defaultToolRegistry
} from "./defaultRegistry.js";
import type {
  McpTypeEntry,
  ProviderRegistryEntry,
  ToolRegistryEntry
} from "../types/registry.js";

function validateEntries<T>(
  entries: unknown[],
  schema: { parse: (value: unknown) => T },
  kind: string
): T[] {
  return entries.map((entry, index) => {
    try {
      return schema.parse(entry);
    } catch (error) {
      throw new RegistryValidationError(`Invalid ${kind} entry at index ${index}: ${String(error)}`);
    }
  });
}

export function loadToolRegistry(): ToolRegistryEntry[] {
  return validateEntries(defaultToolRegistry, ToolRegistrySchema, "tool registry");
}

export function loadMcpTypes(): McpTypeEntry[] {
  return validateEntries(defaultMcpTypes, McpTypeSchema, "MCP type registry");
}

export function loadProviders(): ProviderRegistryEntry[] {
  return validateEntries(defaultProviderRegistry, ProviderRegistrySchema, "provider registry");
}

export function getTool(toolId: string): ToolRegistryEntry | undefined {
  return loadToolRegistry().find((tool) => tool.id === toolId);
}
