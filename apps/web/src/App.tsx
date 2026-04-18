import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, CheckCircle2, CircleAlert, Copy, Sparkles } from "lucide-react";
import {
  convertSnippet,
  loadMcpTypes,
  loadProviders,
  loadToolRegistry
} from "@mcp-converter/core";
import type { CompatibilityWarning } from "@mcp-converter/core";
import type { ProviderRegistryEntry, ToolRegistryEntry } from "@mcp-converter/core";
import { Badge } from "./components/ui/badge.js";
import { Button } from "./components/ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./components/ui/card.js";
import { Select } from "./components/ui/select.js";
import { Textarea } from "./components/ui/textarea.js";

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

const targetTools = loadToolRegistry().filter(
  (tool: ToolRegistryEntry) => tool.supportLevel !== "planned"
);
const providers = loadProviders();
const mcpTypes = loadMcpTypes();
const toolGroups = {
  "Verified now": targetTools.filter(
    (tool: ToolRegistryEntry) => tool.supportLevel === "converter-ready"
  ),
  "Tracked next": targetTools.filter(
    (tool: ToolRegistryEntry) => tool.supportLevel === "registry-seeded"
  )
};

export default function App() {
  const [input, setInput] = useState(seededExamples.hostinger);
  const [targetTool, setTargetTool] = useState("codex");
  const [selectedExample, setSelectedExample] = useState("hostinger");

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(245,245,244,0.88)_45%,rgba(245,245,244,1)_100%)] text-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:px-10 lg:px-12">
        <section className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-white/90 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur xl:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.26))]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-5">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
                Deterministic MCP conversion
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  Convert MCP configs across clients without guessing.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
                  Paste a supported snippet, choose the target tool, and get output that
                  stays tied to rules, fixtures, and documented client behavior.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    if (result.state === "success") {
                      navigator.clipboard.writeText(result.data.output);
                    }
                  }}
                >
                  <Copy className="mr-2 size-4" />
                  Copy output
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedExample("supabase");
                    setInput(seededExamples.supabase);
                  }}
                >
                  <Sparkles className="mr-2 size-4" />
                  Try Supabase
                </Button>
              </div>
            </div>

            <Card className="rounded-2xl border-neutral-200 bg-neutral-950 text-white shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-white">Coverage snapshot</CardTitle>
                <CardDescription className="text-neutral-400">
                  Current breadth of the converter source of truth.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Metric value={targetTools.length} label="tracked tools" />
                <Metric value={toolGroups["Verified now"].length} label="verified targets" />
                <Metric value={providers.length} label="providers" />
                <Metric value={mcpTypes.length} label="transport types" />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card className="rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle>Converter workspace</CardTitle>
              <CardDescription>
                Swap examples, change the target, then review warnings before copying.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Example">
                  <Select
                    value={selectedExample}
                    onChange={(event) => {
                      const next = event.target.value as keyof typeof seededExamples;
                      setSelectedExample(next);
                      setInput(seededExamples[next]);
                    }}
                  >
                    <option value="hostinger">Hostinger</option>
                    <option value="supabase">Supabase</option>
                  </Select>
                </Field>
                <Field label="Target tool">
                  <Select value={targetTool} onChange={(event) => setTargetTool(event.target.value)}>
                    <optgroup label="Verified now">
                      {toolGroups["Verified now"].map((tool: ToolRegistryEntry) => (
                        <option key={tool.id} value={tool.id}>
                          {tool.displayName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Tracked next">
                      {toolGroups["Tracked next"].map((tool: ToolRegistryEntry) => (
                        <option key={tool.id} value={tool.id}>
                          {tool.displayName}
                        </option>
                      ))}
                    </optgroup>
                  </Select>
                </Field>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
                <Card className="rounded-xl border-neutral-200 bg-neutral-50/60 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Input</CardTitle>
                    <CardDescription>Edit or paste a supported MCP snippet.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      className="min-h-[420px] resize-y border-neutral-200 bg-white font-mono text-[13px] leading-6"
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl border-neutral-200 bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Output</CardTitle>
                    <CardDescription>
                      Rules-backed result with explanations and follow-up steps.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {result.state === "success" ? (
                      <>
                        <pre className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-[13px] leading-6 text-neutral-800">
                          {result.data.output}
                        </pre>
                        <InfoList
                          title="Warnings"
                          icon={
                            result.data.warnings.length === 0 ? (
                              <CheckCircle2 className="size-4 text-emerald-600" />
                            ) : (
                              <CircleAlert className="size-4 text-amber-600" />
                            )
                          }
                          items={
                            result.data.warnings.length === 0
                              ? ["No warnings."]
                              : result.data.warnings.map(
                                  (warning: CompatibilityWarning) => warning.message
                                )
                          }
                        />
                        <InfoList
                          title="Manual steps"
                          icon={<ArrowUpRight className="size-4 text-neutral-700" />}
                          items={result.data.explanation.manualSteps}
                        />
                      </>
                    ) : (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {result.message}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Verified targets</CardTitle>
                <CardDescription>
                  Publicly documented client paths already backed by formatter tests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {toolGroups["Verified now"].map((tool: ToolRegistryEntry) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                  >
                    <span>{tool.displayName}</span>
                    <Badge variant="secondary">ready</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Seeded providers</CardTitle>
                <CardDescription>
                  Current provider coverage driving examples and support expansion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {providers.map((provider: ProviderRegistryEntry) => (
                  <div
                    key={provider.id}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
                  >
                    {provider.displayName}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-sm text-neutral-400">{label}</div>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-neutral-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function InfoList({
  title,
  icon,
  items
}: {
  title: string;
  icon: ReactNode;
  items: string[];
}) {
  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        {icon}
        {title}
      </div>
      <ul className="space-y-2 text-sm leading-6 text-neutral-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[10px] size-1.5 rounded-full bg-neutral-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
