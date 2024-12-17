import { ExceptionBase } from '@libs/exceptions';

export class SymbolNotFoundError extends ExceptionBase {
  static readonly message = 'Symbol not found';

  public readonly code = 'SYMBOL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(SymbolNotFoundError.message, cause, metadata);
  }
}

export class SymbolCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Symbol code already exists';

  public readonly code = 'SYMBOL.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(SymbolCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class SymbolCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Symbol code already in use';

  public readonly code = 'SYMBOL.CODE_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(SymbolCodeAlreadyInUseError.message, cause, metadata);
  }
}
