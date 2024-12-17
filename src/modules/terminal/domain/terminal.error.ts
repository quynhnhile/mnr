import { ExceptionBase } from '@libs/exceptions';

export class TerminalNotFoundError extends ExceptionBase {
  static readonly message = 'Terminal not found';

  public readonly code = 'TERMINAL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(TerminalNotFoundError.message, cause, metadata);
  }
}
export class TerminalCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Terminal code already exists';

  public readonly code = 'TERMINAL.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(TerminalCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class TerminalCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Terminal code already in use';

  public readonly code = 'TERMINAL.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(TerminalCodeAlreadyInUseError.message, cause, metadata);
  }
}
