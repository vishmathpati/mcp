export class EmptyInputError extends Error {
  constructor() {
    super("Input is empty after cleanup.");
    this.name = "EmptyInputError";
  }
}

export class UnsupportedInputFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedInputFormatError";
  }
}

export class RegistryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryValidationError";
  }
}

export class UnsupportedTargetToolError extends Error {
  constructor(toolId: string, detail?: string) {
    super(detail ? `Unsupported target tool: ${toolId}. ${detail}` : `Unsupported target tool: ${toolId}`);
    this.name = "UnsupportedTargetToolError";
  }
}

export class UnsupportedMcpTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedMcpTypeError";
  }
}
