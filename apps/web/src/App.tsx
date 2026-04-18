import { useMemo, useState } from "react";
import {
  convertSnippet,
  loadMcpTypes,
  loadProviders,
  loadToolRegistry
} from "@mcp-converter/core";
import type { CompatibilityWarning } from "@mcp-converter/core";

const seededExamples = {
  hostinger: `{
  "mcpServers": {
    "hostinger-api": {
      "command": "hostinger-api-mcp",
      "env": {
        "DEBUG": "false",
        "APITOKEN": "YOUR API TOKEN"
      }
    }
  }
}`,
  supabase: `{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}`
};

const targetTools = loadToolRegistry().filter((tool) => tool.supportLevel !== "planned");
const providers = loadProviders();
const mcpTypes = loadMcpTypes();
const toolGroups = {
  "Verified now": targetTools.filter((tool) => tool.supportLevel === "converter-ready"),
  "Tracked next": targetTools.filter((tool) => tool.supportLevel === "registry-seeded")
};

export default function App() {
  const [input, setInput] = useState(seededExamples.hostinger);
  const [targetTool, setTargetTool] = useState("codex");

  const result = useMemo(() => {
    try {
      return {
        state: "success" as const,
        data: convertSnippet(input, targetTool)
      };
    } catch (error) {
      return {
        state: "error" as const,
        message: error instanceof Error ? error.message : "Unknown conversion error."
      };
    }
  }, [input, targetTool]);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Deterministic MCP conversion</p>
        <h1>MCP Converter</h1>
        <p className="lede">
          Paste a supported MCP snippet, choose a supported target tool, and get a
          rules-backed config plus warnings and manual next steps.
        </p>
        <div className="stats">
          <article>
            <strong>{targetTools.length}</strong>
            <span>target tools tracked</span>
          </article>
          <article>
            <strong>{toolGroups["Verified now"].length}</strong>
            <span>verified formatter targets</span>
          </article>
          <article>
            <strong>{providers.length}</strong>
            <span>providers seeded</span>
          </article>
          <article>
            <strong>{mcpTypes.length}</strong>
            <span>MCP transport types</span>
          </article>
        </div>
      </section>

      <section className="controls">
        <label>
          Example
          <select
            onChange={(event) =>
              setInput(seededExamples[event.target.value as keyof typeof seededExamples])
            }
            defaultValue="hostinger"
          >
            <option value="hostinger">Hostinger</option>
            <option value="supabase">Supabase</option>
          </select>
        </label>

        <label>
          Target tool
          <select value={targetTool} onChange={(event) => setTargetTool(event.target.value)}>
            <optgroup label="Verified now">
              {toolGroups["Verified now"].map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.displayName}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tracked next">
              {toolGroups["Tracked next"].map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.displayName}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>Input</h2>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="panel">
          <h2>Output</h2>
          {result.state === "success" ? (
            <>
              <pre>{result.data.output}</pre>
              <h3>Warnings</h3>
              <ul>
                {result.data.warnings.length === 0 ? (
                  <li>No warnings.</li>
                ) : (
                  result.data.warnings.map((warning: CompatibilityWarning) => (
                    <li key={warning.code}>{warning.message}</li>
                  ))
                )}
              </ul>
              <h3>Manual steps</h3>
              <ul>
                {result.data.explanation.manualSteps.map((step: string) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="error">{result.message}</p>
          )}
        </div>
      </section>
    </main>
  );
}
