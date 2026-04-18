import { z } from "zod";

export const ToolRegistrySchema = z.object({
  id: z.string(),
  displayName: z.string(),
  supportLevel: z.enum(["converter-ready", "registry-seeded", "planned"]),
  configFamily: z.enum([
    "json-mcpServers",
    "opencode-mcp",
    "zed-context-servers",
    "amp-settings"
  ]),
  configFormat: z.enum(["json", "jsonc"]),
  supportedMcpTypes: z.array(z.string()),
  supportedCapabilities: z.array(z.string()),
  unsupportedCapabilities: z.array(z.string()),
  homepage: z.url(),
  sourceReference: z.url(),
  notes: z.array(z.string())
});

export const McpTypeSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  transport: z.enum(["stdio", "http", "streamable-http"]),
  description: z.string(),
  requiredFields: z.array(z.string()),
  optionalFields: z.array(z.string())
});

export const ProviderRegistrySchema = z.object({
  id: z.string(),
  displayName: z.string(),
  homepage: z.url(),
  docsReference: z.url(),
  authMode: z.enum(["none", "env", "oauth", "hosted-login", "mixed"]),
  knownMcpTypes: z.array(z.string()),
  knownSourceFormats: z.array(z.string()),
  notes: z.array(z.string())
});
