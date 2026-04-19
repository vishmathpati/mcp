import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../../../");
const catalogPath = path.join(projectRoot, "data/clean/catalogs/top-mcp-servers.json");

describe("server catalog", () => {
  it("tracks the first Cursor Directory MCP candidate set", () => {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

    expect(catalog.strategy).toBe("cursor-directory-first");
    expect(catalog.totalCandidates).toBeGreaterThanOrEqual(30);
    expect(catalog.entries[0].id).toBe("github");
    expect(catalog.entries[1].id).toBe("supabase");
    expect(catalog.entries[2].id).toBe("vercel");
  });

  it("keeps only the minimal candidate fields", () => {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

    for (const entry of catalog.entries) {
      expect(Object.keys(entry).sort()).toEqual(
        ["description", "discoveryUrl", "id", "name", "source", "verificationStatus"].sort()
      );
    }
  });
});
