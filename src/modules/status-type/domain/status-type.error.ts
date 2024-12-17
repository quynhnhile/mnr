import { ExceptionBase } from '@libs/exceptions';

export class StatusTypeNotFoundError extends ExceptionBase {
  static readonly message = 'Status Type not found';

  public readonly code = 'STATUS_TYPE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(StatusTypeNotFoundError.message, cause, metadata);
  }
}

export class StatusTypeCodeAlreadyExsitError extends ExceptionBase {
  static readonly message = 'Status Type code already exsits';

  public readonly code = 'STATUS_TYPE.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(StatusTypeCodeAlreadyExsitError.message, cause, metadata);
  }
}

export class StatusTypeCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Status Type code already in use';

  public readonly code = 'STATUS_TYPE.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(StatusTypeCodeAlreadyInUseError.message, cause, metadata);
  }
}
