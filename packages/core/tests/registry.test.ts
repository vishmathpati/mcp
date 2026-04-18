import { describe, expect, it } from "vitest";
import { loadMcpTypes, loadProviders, loadToolRegistry } from "../src/registry/loadRegistry.js";

describe("registry", () => {
  it("loads a broad major tool list", () => {
    const tools = loadToolRegistry();
    expect(tools.length).toBeGreaterThanOrEqual(12);
    expect(tools.some((tool) => tool.id === "codex")).toBe(true);
    expect(tools.some((tool) => tool.id === "claude-code")).toBe(true);
    expect(tools.some((tool) => tool.id === "cursor")).toBe(true);
  });

  it("loads MCP types", () => {
    const types = loadMcpTypes();
    expect(types.map((entry) => entry.id)).toContain("local-stdio");
    expect(types.map((entry) => entry.id)).toContain("hosted-remote");
  });

  it("loads major providers", () => {
    const providers = loadProviders();
    expect(providers.map((entry) => entry.id)).toContain("hostinger");
    expect(providers.map((entry) => entry.id)).toContain("supabase");
  });
});
