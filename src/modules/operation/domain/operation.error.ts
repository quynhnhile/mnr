import { ExceptionBase } from '@libs/exceptions';

export class OperationNotFoundError extends ExceptionBase {
  static readonly message = 'Operation not found';

  public readonly code = 'OPERATION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(OperationNotFoundError.message, cause, metadata);
  }
}

export class OperationCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Operation code already exists';

  public readonly code = 'OPERATION.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(OperationCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class OperationCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Operation code already in use';

  public readonly code = 'OPERATION.CODE_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(OperationCodeAlreadyInUseError.message, cause, metadata);
  }
}
