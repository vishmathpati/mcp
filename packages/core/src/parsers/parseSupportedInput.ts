import { z } from "zod";
import { UnsupportedInputFormatError } from "../errors/index.js";

const ParsedServerSchema = z
  .object({
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string(), z.string()).optional(),
    url: z.url().optional(),
    headers: z.record(z.string(), z.string()).optional()
  })
  .refine((server) => Boolean(server.command || server.url), {
    message: "Each MCP server must include either a command or a url."
  });

const ParsedSnippetSchema = z.object({
  mcpServers: z.record(z.string(), ParsedServerSchema)
});

export type ParsedSnippet = z.infer<typeof ParsedSnippetSchema>;

export function parseSupportedInput(input: string): ParsedSnippet {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(input);
  } catch {
    throw new UnsupportedInputFormatError(
      "Only supported JSON MCP snippet formats are accepted in release 1."
    );
  }

  const result = ParsedSnippetSchema.safeParse(parsedJson);

  if (!result.success) {
    throw new UnsupportedInputFormatError(
      "The pasted snippet is not a supported MCP config shape."
    );
  }

  return result.data;
}
