import { describe, it, expect } from "vitest";
import { A2AProtocol, A2A_CONTEXT, A2A_TYPES } from "../src/index";
import {
  createConjecture,
  validateConjecture,
} from "../src/conjecture";
import {
  createExperiment,
  validateExperiment,
} from "../src/experiment";
import {
  createTopology,
  createPersistencePoint,
  validateTopology,
} from "../src/topology";
import { createSheaf, validateSheaf } from "../src/sheaf";
import { createSymplectic, validateSymplectic, createTrajectory } from "../src/symplectic";
import { createLibraryCapability } from "../src/library";

const glmAgent = { name: "glm-agent", model: "glm-5.1", version: "1.0" };
const deepseekAgent = { name: "deepseek-agent", model: "deepseek-chat", version: "1.0" };

describe("A2A Protocol", () => {
  const protocol = new A2AProtocol(glmAgent);

  it("creates and validates a conjecture message", () => {
    const c = createConjecture(
      "eigenbasis-hypothesis",
      "glm-5.1",
      "Constraint matrices admit eigenbasis decomposition",
      "supported",
      [],
      ["Eigenvalue clustering at 1.0"],
      0.92
    );
    const msg = protocol.createConjectureMessage(c);
    expect(msg["@type"]).toBe(A2A_TYPES.CONJECTURE);
    expect(msg["@context"]).toBe(A2A_CONTEXT);
    expect(msg.sender.model).toBe("glm-5.1");
    const result = protocol.validate(msg);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("creates and validates an experiment message", () => {
    const exp = createExperiment(
      "exp-001",
      "gudhi",
      "2026-05-27",
      "eigenvalue clustering confirmed",
      { mean_eigenvalue: 1.001, std: 0.012 },
      10000,
      0.003,
      0.87
    );
    const msg = protocol.createExperimentMessage(exp);
    expect(msg["@type"]).toBe(A2A_TYPES.EXPERIMENT);
    const result = protocol.validate(msg);
    expect(result.valid).toBe(true);
  });

  it("creates and validates a topology message with persistence diagram", () => {
    const topo = createTopology(
      [
        createPersistencePoint(0, 0.5, 0),
        createPersistencePoint(0.1, 2.3, 1),
        createPersistencePoint(0, Infinity, 0),
      ],
      [1, 2, 0],
      { "uniform_random": 0.42 }
    );
    const msg = protocol.createTopologyMessage(topo);
    expect(msg["@type"]).toBe(A2A_TYPES.TOPOLOGY);
    const result = protocol.validate(msg);
    expect(result.valid).toBe(true);
  });

  it("creates and validates a sheaf message with stalks and restrictions", () => {
    const sheaf = createSheaf(
      "S² with 3-point cover",
      { U1: { dim: 2, basis: ["e1", "e2"] }, U2: { dim: 2, basis: ["f1", "f2"] }, U3: { dim: 1, basis: ["g1"] } },
      [
        { source: "U1", target: "U2", map: [[1, 0], [0, 1]] },
        { source: "U1", target: "U3", map: [[1]] },
      ],
      1,
      0
    );
    const msg = protocol.createSheafMessage(sheaf);
    expect(msg["@type"]).toBe(A2A_TYPES.SHEAF);
    const result = protocol.validate(msg);
    expect(result.valid).toBe(true);
  });

  it("creates and validates a library advertisement", () => {
    const lib = createLibraryCapability(
      "constraint-topology",
      "python",
      "0.3.0",
      ["persistence", "wasserstein", "betti", "sheaf-cohomology"],
      ["distance_matrix", "point_cloud"],
      ["persistence_diagram", "betti_numbers"],
      "https://github.com/SuperInstance/constraint-topology"
    );
    const msg = protocol.createLibraryAdvert(lib);
    expect(msg["@type"]).toBe(A2A_TYPES.LIBRARY);
    const result = protocol.validate(msg);
    expect(result.valid).toBe(true);
  });

  it("parse/serialize round-trip preserves data", () => {
    const c = createConjecture("test-id", "glm-5.1", "Test statement", "untested", [], [], 0.5);
    const msg = protocol.createConjectureMessage(c);
    const serialized = protocol.serialize(msg);
    const parsed = protocol.parse(serialized);
    expect(parsed).toEqual(msg);
  });

  it("invalid message fails validation", () => {
    const badMsg = {
      "@context": A2A_CONTEXT,
      "@type": A2A_TYPES.CONJECTURE,
      sender: { name: "", model: "", version: "1.0" },
      timestamp: "not-a-date",
      payload: { id: "", statement: "", status: "invalid", confidence: 2.0, evidence: [], predictions: [] },
    };
    const result = protocol.validate(badMsg as any);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("creates batch scoreboard with multiple conjectures", () => {
    const conjectures = [
      createConjecture("c1", "glm-5.1", "Statement 1", "supported", [], [], 0.9),
      createConjecture("c2", "glm-5.1", "Statement 2", "partial", [], [], 0.6),
      createConjecture("c3", "glm-5.1", "Statement 3", "refuted", [], [], 0.1),
    ];
    const msg = protocol.createScoreboard(conjectures);
    expect(msg["@type"]).toBe(A2A_TYPES.SCOREBOARD);
    expect((msg.payload as any).conjectures).toHaveLength(3);
  });

  it("generates eigenbasis report with all 10 conjectures", () => {
    const msg = protocol.createEigenbasisReport();
    expect(msg["@type"]).toBe(A2A_TYPES.EIGENBASIS_REPORT);
    expect((msg.payload as any).conjectures).toHaveLength(10);
    const ids = (msg.payload as any).conjectures.map((c: any) => c.id);
    expect(ids).toContain("eigenbasis-existence");
    expect(ids).toContain("cohomological-obstruction");
  });

  it("JSON-LD context is valid", () => {
    const c = createConjecture("x", "glm-5.1", "test", "untested", [], [], 0.5);
    const msg = protocol.createConjectureMessage(c);
    expect(msg["@context"]).toBe("https://superinstance.org/a2a/context/v1");
    expect(msg["@type"]).toMatch(/^a2a:/);
  });

  it("cross-agent exchange: GLM sends conjecture, DeepSeek sends experiment", () => {
    const glm = new A2AProtocol(glmAgent);
    const ds = new A2AProtocol(deepseekAgent);

    const c = createConjecture("cross-test", "glm-5.1", "Shared conjecture", "supported", [], [], 0.8);
    const conjMsg = glm.createConjectureMessage(c);
    expect(conjMsg.sender.model).toBe("glm-5.1");

    const exp = createExperiment("exp-cross", "ripser", "2026-05-27", "confirmed", { accuracy: 0.95 }, 5000, 0.001);
    const expMsg = ds.createExperimentMessage(exp);
    expect(expMsg.sender.model).toBe("deepseek-chat");

    // DeepSeek receives GLM's conjecture and validates
    const parsed = ds.parse(ds.serialize(conjMsg));
    expect(parsed.payload).toEqual(c);

    // GLM receives DeepSeek's experiment and validates
    const result = glm.validate(expMsg);
    expect(result.valid).toBe(true);
  });

  it("performance: serialize 1000 messages", () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      const exp = createExperiment(
        `perf-${i}`,
        "gudhi",
        "2026-05-27",
        "ok",
        { idx: i },
        100
      );
      const msg = protocol.createExperimentMessage(exp);
      protocol.serialize(msg);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(2000); // 2 seconds max
  });

  it("validates topology with death < birth", () => {
    const badTopo = createTopology(
      [createPersistencePoint(5, 2, 0)], // death < birth
      [1, 0]
    );
    const errors = validateTopology(badTopo);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/death.*birth/);
  });

  it("validates sheaf with negative cohomology", () => {
    const badSheaf = createSheaf("X", { U1: "data" }, [], -1, 0);
    const errors = validateSheaf(badSheaf);
    expect(errors).toContain("h0 must be non-negative: -1");
  });
});
