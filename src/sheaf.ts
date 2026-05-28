import { SheafExchange } from "./schema";

export function createSheaf(
  space: string,
  stalks: Record<string, unknown>,
  restrictions: Array<{ source: string; target: string; map: unknown }>,
  h0: number,
  h1: number
): SheafExchange {
  return { space, stalks, restrictions, h0, h1 };
}

export function validateSheaf(s: SheafExchange): string[] {
  const errors: string[] = [];
  if (!s.space) errors.push("Sheaf missing space description");
  if (!s.stalks || Object.keys(s.stalks).length === 0) errors.push("Sheaf must have at least one stalk");
  if (s.h0 < 0) errors.push(`h0 must be non-negative: ${s.h0}`);
  if (s.h1 < 0) errors.push(`h1 must be non-negative: ${s.h1}`);
  for (const r of s.restrictions) {
    if (!r.source || !r.target) errors.push("Restriction missing source or target");
  }
  return errors;
}
