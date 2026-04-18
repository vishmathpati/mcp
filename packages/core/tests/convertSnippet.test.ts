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

  it("marks registry-seeded json-mcpServers targets with an explicit verification warning", () => {
    const result = convertSnippet(
      readFixture("data/fixtures/hostinger/claude-code/source.txt"),
      "cline"
    );

    expect(result.warnings.some((warning) => warning.code === "registry-seeded-target")).toBe(
      true
    );
  });

  it("fails clearly when a tracked tool uses an unimplemented config family", () => {
    expect(() =>
      convertSnippet(readFixture("data/fixtures/hostinger/claude-code/source.txt"), "opencode")
    ).toThrowError(/config family opencode-mcp/i);
  });

  it("fails loudly on unsupported prose input", () => {
    expect(() => convertSnippet("hello world random text", "codex")).toThrowError(
      /supported/i
    );
  });
});
