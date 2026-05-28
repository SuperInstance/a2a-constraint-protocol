# a2a-constraint-protocol

A TypeScript + JSON-LD library implementing an Agent-to-Agent (A2A) protocol for sharing constraint-native mathematical results between AI agents. Part of the [SuperInstance](https://github.com/SuperInstance) ecosystem.

## What It Does

Agents use this protocol to exchange:

- **Conjecture status** — supported / partial / refuted / untested
- **Experiment results** — with key metrics, p-values, effect sizes
- **Library capabilities** — what math tools an agent can use
- **Topological structures** — persistence diagrams, Betti numbers, Wasserstein distances
- **Sheaf structures** — stalks, restriction maps, cohomology groups
- **Symplectic structures** — trajectories, conservation laws, symplectic forms

All messages are JSON-LD compatible for semantic web interoperability.

## Install

```bash
npm install a2a-constraint-protocol
```

## Quick Start

```typescript
import { A2AProtocol } from "a2a-constraint-protocol";

const protocol = new A2AProtocol({
  name: "my-agent",
  model: "glm-5.1",
  version: "1.0",
});

// Create a conjecture message
const msg = protocol.createConjectureMessage({
  id: "eigenbasis-hypothesis",
  source_model: "glm-5.1",
  statement: "Constraint matrices admit eigenbasis decomposition",
  status: "supported",
  evidence: [],
  predictions: ["Eigenvalue clustering at 1.0"],
  confidence: 0.92,
});

// Validate
const result = protocol.validate(msg);
console.log(result.valid); // true

// Serialize for transport
const json = protocol.serialize(msg);

// Parse incoming message
const received = protocol.parse(json);
```

## API

### `A2AProtocol`

| Method | Description |
|--------|-------------|
| `createConjectureMessage(conjecture)` | Create a conjecture status message |
| `createExperimentMessage(result)` | Create an experiment result message |
| `createTopologyMessage(topology)` | Create a topological structure message |
| `createSheafMessage(sheaf)` | Create a sheaf structure message |
| `createSymplecticMessage(symplectic)` | Create a symplectic structure message |
| `createLibraryAdvert(capability)` | Advertise library capabilities |
| `validate(message)` | Validate any A2A message |
| `parse(raw)` | Parse JSON string to A2AMessage |
| `serialize(message)` | Serialize A2AMessage to JSON-LD string |
| `createScoreboard(conjectures)` | Batch conjecture scoreboard |
| `createEigenbasisReport()` | Pre-built report with all 10 core conjectures |

## Message Format

All messages follow JSON-LD structure:

```json
{
  "@context": "https://superinstance.org/a2a/context/v1",
  "@type": "a2a:ConjectureMessage",
  "sender": { "name": "...", "model": "...", "version": "..." },
  "timestamp": "2026-05-27T12:00:00.000Z",
  "payload": { ... }
}
```

## License

MIT
