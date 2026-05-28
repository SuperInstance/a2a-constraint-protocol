import { ConjectureStatus, ExperimentResult } from "./schema";

export function createConjecture(
  id: string,
  sourceModel: string,
  statement: string,
  status: ConjectureStatus["status"],
  evidence: ExperimentResult[],
  predictions: string[],
  confidence: number
): ConjectureStatus {
  return { id, source_model: sourceModel, statement, status, evidence, predictions, confidence };
}

export function validateConjecture(c: ConjectureStatus): string[] {
  const errors: string[] = [];
  if (!c.id) errors.push("Conjecture missing id");
  if (!c.statement) errors.push("Conjecture missing statement");
  if (!["supported", "partial", "refuted", "untested"].includes(c.status))
    errors.push(`Invalid status: ${c.status}`);
  if (c.confidence < 0 || c.confidence > 1)
    errors.push(`Confidence out of range [0,1]: ${c.confidence}`);
  return errors;
}
