export type SupportLevel = "converter-ready" | "registry-seeded" | "planned";

export type ConfigFamily = "json-mcpServers" | "opencode-mcp";

export type ToolRegistryEntry = {
  id: string;
  displayName: string;
  supportLevel: SupportLevel;
  configFamily: ConfigFamily;
  configFormat: "json" | "jsonc";
  supportedMcpTypes: string[];
  supportedCapabilities: string[];
  unsupportedCapabilities: string[];
  homepage: string;
  sourceReference: string;
  notes: string[];
};

export type McpTypeEntry = {
  id: string;
  displayName: string;
  transport: "stdio" | "http" | "streamable-http";
  description: string;
  requiredFields: string[];
  optionalFields: string[];
};

export type ProviderRegistryEntry = {
  id: string;
  displayName: string;
  homepage: string;
  docsReference: string;
  authMode: "none" | "env" | "oauth" | "hosted-login" | "mixed";
  knownMcpTypes: string[];
  knownSourceFormats: string[];
  notes: string[];
};
