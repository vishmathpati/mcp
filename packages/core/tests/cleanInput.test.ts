import { describe, expect, it } from "vitest";
import { cleanInput } from "../src/input/cleanInput.js";

describe("cleanInput", () => {
  it("strips markdown code fences", () => {
    expect(cleanInput("```json\n{\"mcpServers\":{}}\n```")).toBe("{\"mcpServers\":{}}");
  });

  it("throws on empty input", () => {
    expect(() => cleanInput("   ")).toThrowError(/empty/i);
  });
});
