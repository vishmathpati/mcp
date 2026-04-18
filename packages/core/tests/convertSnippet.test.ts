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

  it("fails loudly on unsupported prose input", () => {
    expect(() => convertSnippet("hello world random text", "codex")).toThrowError(
      /supported/i
    );
  });
});
