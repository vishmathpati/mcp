import { EmptyInputError } from "../errors/index.js";

export function cleanInput(raw: string): string {
  const trimmed = raw.trim();
  const withoutCodeFence = trimmed
    .replace(/^```(?:json|jsonc)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  if (!withoutCodeFence) {
    throw new EmptyInputError();
  }

  return withoutCodeFence;
}
