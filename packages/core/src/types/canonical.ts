export type CanonicalTransport =
  | {
      type: "stdio";
      command: string;
      args: string[];
    }
  | {
      type: "http";
      url: string;
      headers: Record<string, string>;
    };

export type CanonicalServer = {
  id: string;
  sourceFormat: "json-mcpServers";
  inferredMcpType: string;
  transport: CanonicalTransport;
  env: Record<string, string>;
  notes: string[];
};

export type CanonicalSnippet = {
  servers: CanonicalServer[];
};

export type CompatibilityWarning = {
  code: string;
  message: string;
};

export type ConversionResult = {
  toolId: string;
  output: string;
  warnings: CompatibilityWarning[];
  explanation: {
    changed: string[];
    unchanged: string[];
    manualSteps: string[];
  };
};
