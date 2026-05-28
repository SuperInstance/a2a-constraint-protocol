import { SymplecticExchange, SymplecticTrajectory } from "./schema";

export function createTrajectory(
  initial: number[],
  final: number[],
  trajectory: number[][],
  hamiltonian: number,
  steps: number
): SymplecticTrajectory {
  return { initial_state: initial, final_state: final, trajectory, hamiltonian_value: hamiltonian, time_steps: steps };
}

export function createSymplectic(
  dimension: number,
  trajectories: SymplecticTrajectory[],
  conservationLaws: Array<{ name: string; initial: number; final: number; deviation: number }>,
  form: number[][]
): SymplecticExchange {
  return { dimension, trajectories, conservation_laws: conservationLaws, symplectic_form: form };
}

export function validateSymplectic(s: SymplecticExchange): string[] {
  const errors: string[] = [];
  if (s.dimension <= 0 || s.dimension % 2 !== 0) errors.push("Dimension must be positive even integer");
  if (!Array.isArray(s.trajectories) || s.trajectories.length === 0)
    errors.push("Must have at least one trajectory");
  for (const cl of s.conservation_laws) {
    if (!cl.name) errors.push("Conservation law missing name");
    if (cl.deviation < 0) errors.push(`Negative deviation for ${cl.name}`);
  }
  return errors;
}
