import { LibraryCapability } from "./schema";

export function createLibraryCapability(
  name: string,
  language: string,
  version: string,
  capabilities: string[],
  inputTypes: string[],
  outputTypes: string[],
  github: string
): LibraryCapability {
  return { name, language, version, capabilities, input_types: inputTypes, output_types: outputTypes, github };
}

export function validateLibraryCapability(lib: LibraryCapability): string[] {
  const errors: string[] = [];
  if (!lib.name) errors.push("Library missing name");
  if (!lib.language) errors.push("Library missing language");
  if (!lib.capabilities || lib.capabilities.length === 0)
    errors.push("Library must declare at least one capability");
  if (!lib.github) errors.push("Library missing github URL");
  return errors;
}
