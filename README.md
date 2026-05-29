# a2a-constraint-protocol

**Agent-to-Agent protocol for sharing constraint-native mathematical results** — JSON-LD messages for conjectures, experiments, topology, sheaves, and symplectic structures. TypeScript library.

## What This Gives You

- **Conjecture messages** — share mathematical conjectures with status, evidence, and confidence
- **Experiment results** — exchange metrics, p-values, and effect sizes
- **Topological structures** — persistence diagrams, Betti numbers, Wasserstein distances
- **Sheaf structures** — stalks, restriction maps, cohomology groups
- **Symplectic structures** — trajectories, conservation laws, symplectic forms
- **JSON-LD compatible** — semantic web interoperability out of the box

## Installation

```bash
npm install a2a-constraint-protocol
```

## Quick Start

```typescript
import { A2AProtocol } from "a2a-constraint-protocol";

const protocol = new A2AProtocol({ name: "my-agent", model: "glm-5.1", version: "1.0" });

const msg = protocol.createConjectureMessage({
  id: "eigenbasis-hypothesis",
  source_model: "glm-5.1",
  statement: "Constraint matrices admit eigenbasis decomposition",
  status: "supported",
  evidence: [],
  predictions: ["Eigenvalue clustering at 1.0"],
  confidence: 0.92,
});

const result = protocol.validate(msg);
console.log(result.valid); // true
```

## API Reference

| Module | Purpose |
|--------|---------|
| `conjecture` | Create and validate conjecture messages |
| `experiment` | Exchange experimental results |
| `topology` | Share persistence diagrams and Betti numbers |
| `sheaf` | Communicate sheaf structures and cohomology |
| `symplectic` | Share Hamiltonian trajectories and conservation laws |
| `library` | Advertise mathematical library capabilities |
| `schema` | JSON-LD schema definitions |
| `validate` | Message validation engine |

## Testing

```bash
npm test
```

## How It Fits

The math communication layer in the SuperInstance agent fleet. Agents use this protocol to share results from `conservation-spectral`, `flux-algebra`, and `topology-lab` computations.

## License

MIT
