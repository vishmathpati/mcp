import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { convertSnippet } from "../src/index.js";

const projectRoot = path.resolve(import.meta.dirname, "../../../");

function readFixture(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

describe("convertSnippet", () => {
  it("converts the Hostinger fixture to Codex output", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "codex"
    );

    expect(result.output).toContain("\"hostinger-api\"");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
  });

  it("converts the Supabase fixture to Codex output", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "codex"
    );

    expect(result.output).toContain("\"supabase\"");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
  });

  it("converts the Hostinger fixture to Continue output", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "continue"
    );

    expect(result.output).toContain("\"hostinger-api\"");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Amazon Q CLI output with remote type", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "amazon-q-cli"
    );

    expect(result.output).toContain("\"supabase\"");
    expect(result.output).toContain("\"type\": \"http\"");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Hostinger fixture to OpenCode local MCP format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "opencode"
    );

    expect(result.output).toContain("\"$schema\": \"https://opencode.ai/config.json\"");
    expect(result.output).toContain("\"mcp\": {");
    expect(result.output).toContain("\"type\": \"local\"");
    expect(result.output).toContain("\"command\": [");
    expect(result.output).toContain("\"hostinger-api-mcp\"");
    expect(result.output).toContain("\"environment\": {");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to OpenCode remote MCP format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "opencode"
    );

    expect(result.output).toContain("\"type\": \"remote\"");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(result.output).toContain("\"enabled\": true");
  });

  it("converts the Hostinger fixture to Cline stdio format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "cline"
    );

    expect(result.output).toContain("\"type\": \"stdio\"");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(result.output).toContain("\"disabled\": false");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Cline remote format with transport warning", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "cline"
    );

    expect(result.output).toContain("\"type\": \"streamableHttp\"");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(result.output).toContain("\"disabled\": false");
    expect(result.warnings.some((warning) => warning.code === "cline-remote-default")).toBe(
      true
    );
  });

  it("converts the Hostinger fixture to Windsurf stdio format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "windsurf"
    );

    expect(result.output).toContain("\"hostinger-api\"");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(result.output).toContain("\"args\": [");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Windsurf remote format with serverUrl", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "windsurf"
    );

    expect(result.output).toContain("\"supabase\"");
    expect(result.output).toContain("\"serverUrl\": \"https://mcp.supabase.com/mcp\"");
    expect(result.output).not.toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Hostinger fixture to Roo Code stdio format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "roo-code"
    );

    expect(result.output).toContain("\"hostinger-api\"");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(result.output).toContain("\"args\": [");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Roo Code remote format with explicit type", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "roo-code"
    );

    expect(result.output).toContain("\"supabase\"");
    expect(result.output).toContain("\"type\": \"streamable-http\"");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "roo-code-remote-default")
    ).toBe(true);
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Hostinger fixture to Zed context_servers stdio format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "zed"
    );

    expect(result.output).toContain("\"context_servers\": {");
    expect(result.output).toContain("\"hostinger-api\": {");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Zed remote format and documents OAuth behavior", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "zed"
    );

    expect(result.output).toContain("\"context_servers\": {");
    expect(result.output).toContain("\"supabase\": {");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(result.output).not.toContain("\"mcpServers\": {");
    expect(result.warnings.some((warning) => warning.code === "zed-oauth-prompt")).toBe(
      true
    );
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Hostinger fixture to Warp CLI MCP format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "warp"
    );

    expect(result.output).toContain("\"mcpServers\": {");
    expect(result.output).toContain("\"hostinger-api\": {");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Warp URL MCP format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "warp"
    );

    expect(result.output).toContain("\"mcpServers\": {");
    expect(result.output).toContain("\"supabase\": {");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Hostinger fixture to Augment Code local MCP format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "augment-code"
    );

    expect(result.output).toContain("\"mcpServers\": {");
    expect(result.output).toContain("\"hostinger-api\": {");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(result.output).not.toContain("\"type\": \"stdio\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Augment Code remote MCP format with explicit type", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "augment-code"
    );

    expect(result.output).toContain("\"mcpServers\": {");
    expect(result.output).toContain("\"supabase\": {");
    expect(result.output).toContain("\"type\": \"http\"");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Hostinger fixture to Amp settings format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "amp"
    );

    expect(result.output).toContain("\"amp.mcpServers\": {");
    expect(result.output).toContain("\"hostinger-api\": {");
    expect(result.output).toContain("\"command\": \"hostinger-api-mcp\"");
    expect(result.output).not.toContain("\"mcpServers\": {");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("converts the Supabase fixture to Amp remote settings format", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/supabase/claude-code/source.txt"),
      "amp"
    );

    expect(result.output).toContain("\"amp.mcpServers\": {");
    expect(result.output).toContain("\"supabase\": {");
    expect(result.output).toContain("\"url\": \"https://mcp.supabase.com/mcp\"");
    expect(
      result.warnings.some((warning) => warning.code === "registry-seeded-target")
    ).toBe(false);
  });

  it("fails loudly on unsupported prose input", () => {
    expect(() => convertSnippet("hello world random text", "codex")).toThrowError(
      /supported/i
    );
  });
});
