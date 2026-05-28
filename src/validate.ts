import { A2AMessage, ValidationResult, A2A_CONTEXT, A2A_TYPES, ConjectureStatus, ExperimentResult, TopologyExchange, SheafExchange, LibraryCapability, SymplecticExchange } from "./schema";
import { validateConjecture } from "./conjecture";
import { validateExperiment } from "./experiment";
import { validateTopology } from "./topology";
import { validateSheaf } from "./sheaf";
import { validateLibraryCapability } from "./library";
import { validateSymplectic } from "./symplectic";

export function validateMessage(message: A2AMessage): ValidationResult {
  const errors: string[] = [];

  // Structural checks
  if (!message["@context"]) errors.push("Missing @context");
  if (!message["@type"]) errors.push("Missing @type");
  if (!message.sender?.name) errors.push("Missing sender name");
  if (!message.sender?.model) errors.push("Missing sender model");
  if (!message.timestamp) errors.push("Missing timestamp");
  if (message.timestamp && isNaN(Date.parse(message.timestamp)))
    errors.push(`Invalid timestamp: ${message.timestamp}`);
  if (message.payload === undefined) errors.push("Missing payload");

  // Type-specific validation
  if (message["@type"] === A2A_TYPES.CONJECTURE) {
    errors.push(...validateConjecture(message.payload as ConjectureStatus));
  } else if (message["@type"] === A2A_TYPES.EXPERIMENT) {
    errors.push(...validateExperiment(message.payload as ExperimentResult));
  } else if (message["@type"] === A2A_TYPES.TOPOLOGY) {
    errors.push(...validateTopology(message.payload as TopologyExchange));
  } else if (message["@type"] === A2A_TYPES.SHEAF) {
    errors.push(...validateSheaf(message.payload as SheafExchange));
  } else if (message["@type"] === A2A_TYPES.LIBRARY) {
    errors.push(...validateLibraryCapability(message.payload as LibraryCapability));
  } else if (message["@type"] === A2A_TYPES.SYMPLECTIC) {
    errors.push(...validateSymplectic(message.payload as SymplecticExchange));
  }

  return { valid: errors.length === 0, errors };
}
