import { ExperimentResult } from "./schema";

export function createExperiment(
  id: string,
  library: string,
  date: string,
  verdict: string,
  keyMetrics: Record<string, number>,
  sampleSize: number,
  pValue?: number,
  effectSize?: number
): ExperimentResult {
  return { id, library, date, verdict, key_metrics: keyMetrics, sample_size: sampleSize, p_value: pValue, effect_size: effectSize };
}

export function validateExperiment(e: ExperimentResult): string[] {
  const errors: string[] = [];
  if (!e.id) errors.push("Experiment missing id");
  if (!e.library) errors.push("Experiment missing library");
  if (!e.date) errors.push("Experiment missing date");
  if (e.sample_size < 0) errors.push("Sample size must be non-negative");
  if (e.p_value !== undefined && (e.p_value < 0 || e.p_value > 1))
    errors.push(`p_value out of range [0,1]: ${e.p_value}`);
  return errors;
}
