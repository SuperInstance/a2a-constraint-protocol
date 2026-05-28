import { TopologyExchange, PersistencePoint } from "./schema";

export function createPersistencePoint(birth: number, death: number, dimension: number): PersistencePoint {
  return { birth, death, dimension };
}

export function createTopology(
  persistenceDiagram: PersistencePoint[],
  bettiNumbers: number[],
  wassersteinDistanceTo?: Record<string, number>
): TopologyExchange {
  return { persistence_diagram: persistenceDiagram, betti_numbers: bettiNumbers, wasserstein_distance_to: wassersteinDistanceTo };
}

export function validateTopology(t: TopologyExchange): string[] {
  const errors: string[] = [];
  if (!Array.isArray(t.persistence_diagram)) {
    errors.push("Missing persistence_diagram");
  } else {
    for (const pt of t.persistence_diagram) {
      if (pt.death < pt.birth) errors.push(`Invalid persistence point: death (${pt.death}) < birth (${pt.birth})`);
      if (pt.dimension < 0) errors.push(`Negative dimension: ${pt.dimension}`);
    }
  }
  if (!Array.isArray(t.betti_numbers)) errors.push("Missing betti_numbers");
  return errors;
}
