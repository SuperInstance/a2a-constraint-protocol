// JSON-LD context and schemas for all math types

export const A2A_CONTEXT = "https://superinstance.org/a2a/context/v1";

export const A2A_TYPES = {
  CONJECTURE: "a2a:ConjectureMessage",
  EXPERIMENT: "a2a:ExperimentMessage",
  TOPOLOGY: "a2a:TopologyMessage",
  SHEAF: "a2a:SheafMessage",
  SYMPLECTIC: "a2a:SymplecticMessage",
  LIBRARY: "a2a:LibraryAdvert",
  SCOREBOARD: "a2a:ScoreboardMessage",
  EIGENBASIS_REPORT: "a2a:EigenbasisReport",
} as const;

export interface AgentID {
  name: string;
  model: string;
  version: string;
}

export interface A2AMessage {
  "@context": string;
  "@type": string;
  sender: AgentID;
  timestamp: string;
  payload: unknown;
}

export interface ConjectureStatus {
  id: string;
  source_model: string;
  statement: string;
  status: "supported" | "partial" | "refuted" | "untested";
  evidence: ExperimentResult[];
  predictions: string[];
  confidence: number;
}

export interface ExperimentResult {
  id: string;
  library: string;
  date: string;
  verdict: string;
  key_metrics: Record<string, number>;
  sample_size: number;
  p_value?: number;
  effect_size?: number;
}

export interface PersistencePoint {
  birth: number;
  death: number;
  dimension: number;
}

export interface TopologyExchange {
  persistence_diagram: PersistencePoint[];
  betti_numbers: number[];
  wasserstein_distance_to?: Record<string, number>;
}

export interface SheafExchange {
  space: string;
  stalks: Record<string, unknown>;
  restrictions: Array<{ source: string; target: string; map: unknown }>;
  h0: number;
  h1: number;
}

export interface SymplecticTrajectory {
  initial_state: number[];
  final_state: number[];
  trajectory: number[][];
  hamiltonian_value: number;
  time_steps: number;
}

export interface SymplecticExchange {
  dimension: number;
  trajectories: SymplecticTrajectory[];
  conservation_laws: Array<{ name: string; initial: number; final: number; deviation: number }>;
  symplectic_form: number[][];
}

export interface LibraryCapability {
  name: string;
  language: string;
  version: string;
  capabilities: string[];
  input_types: string[];
  output_types: string[];
  github: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Full JSON-LD context definition
export const JSONLD_CONTEXT = {
  "@context": {
    a2a: "https://superinstance.org/a2a/vocab#",
    sender: "a2a:sender",
    timestamp: "a2a:timestamp",
    payload: "a2a:payload",
    name: "a2a:name",
    model: "a2a:model",
    version: "a2a:version",
    id: "a2a:id",
    source_model: "a2a:sourceModel",
    statement: "a2a:statement",
    status: "a2a:status",
    evidence: "a2a:evidence",
    predictions: "a2a:predictions",
    confidence: "a2a:confidence",
    library: "a2a:library",
    date: "a2a:date",
    verdict: "a2a:verdict",
    key_metrics: "a2a:keyMetrics",
    sample_size: "a2a:sampleSize",
    p_value: "a2a:pValue",
    effect_size: "a2a:effectSize",
    persistence_diagram: "a2a:persistenceDiagram",
    betti_numbers: "a2a:bettiNumbers",
    wasserstein_distance_to: "a2a:wassersteinDistanceTo",
    birth: "a2a:birth",
    death: "a2a:death",
    dimension: "a2a:dimension",
    space: "a2a:space",
    stalks: "a2a:stalks",
    restrictions: "a2a:restrictions",
    h0: "a2a:h0",
    h1: "a2a:h1",
    capabilities: "a2a:capabilities",
    input_types: "a2a:inputTypes",
    output_types: "a2a:outputTypes",
    github: "a2a:github",
    language: "a2a:language",
    conjectures: "a2a:conjectures",
  },
};
