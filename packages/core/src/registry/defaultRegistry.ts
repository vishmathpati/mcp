import amazonQCli from "../../../../data/registry/tools/amazon-q-cli.json";
import amp from "../../../../data/registry/tools/amp.json";
import augmentCode from "../../../../data/registry/tools/augment-code.json";
import claudeCode from "../../../../data/registry/tools/claude-code.json";
import claudeDesktop from "../../../../data/registry/tools/claude-desktop.json";
import cline from "../../../../data/registry/tools/cline.json";
import codex from "../../../../data/registry/tools/codex.json";
import continueTool from "../../../../data/registry/tools/continue.json";
import cursor from "../../../../data/registry/tools/cursor.json";
import opencode from "../../../../data/registry/tools/opencode.json";
import replit from "../../../../data/registry/tools/replit.json";
import rooCode from "../../../../data/registry/tools/roo-code.json";
import t3Chat from "../../../../data/registry/tools/t3-chat.json";
import vscodeGithubCopilot from "../../../../data/registry/tools/vscode-github-copilot.json";
import warp from "../../../../data/registry/tools/warp.json";
import windsurf from "../../../../data/registry/tools/windsurf.json";
import zed from "../../../../data/registry/tools/zed.json";
import cloudflare from "../../../../data/registry/providers/cloudflare.json";
import github from "../../../../data/registry/providers/github.json";
import hostinger from "../../../../data/registry/providers/hostinger.json";
import notion from "../../../../data/registry/providers/notion.json";
import stripe from "../../../../data/registry/providers/stripe.json";
import supabase from "../../../../data/registry/providers/supabase.json";
import vercel from "../../../../data/registry/providers/vercel.json";
import hostedRemote from "../../../../data/registry/mcp-types/hosted-remote.json";
import localStdio from "../../../../data/registry/mcp-types/local-stdio.json";
import streamableHttp from "../../../../data/registry/mcp-types/streamable-http.json";
import {
  McpTypeSchema,
  ProviderRegistrySchema,
  ToolRegistrySchema
} from "./schemas.js";
import type {
  McpTypeEntry,
  ProviderRegistryEntry,
  ToolRegistryEntry
} from "../types/registry.js";

export const defaultToolRegistry: ToolRegistryEntry[] = [
  amazonQCli,
  amp,
  augmentCode,
  claudeCode,
  claudeDesktop,
  cline,
  codex,
  continueTool,
  cursor,
  opencode,
  replit,
  rooCode,
  t3Chat,
  vscodeGithubCopilot,
  warp,
  windsurf,
  zed
].map((entry) => ToolRegistrySchema.parse(entry));

export const defaultProviderRegistry: ProviderRegistryEntry[] = [
  cloudflare,
  github,
  hostinger,
  notion,
  stripe,
  supabase,
  vercel
].map((entry) => ProviderRegistrySchema.parse(entry));

export const defaultMcpTypes: McpTypeEntry[] = [hostedRemote, localStdio, streamableHttp].map(
  (entry) => McpTypeSchema.parse(entry)
);
