import { ExceptionBase } from '@libs/exceptions';

export class CleanMethodNotFoundError extends ExceptionBase {
  static readonly message = 'Clean method not found';

  public readonly code = 'CLEAN_METHOD.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(CleanMethodNotFoundError.message, cause, metadata);
  }
}

export class CleanMethodCodeAlreadyExsitError extends ExceptionBase {
  static readonly message = 'Clean method code already exsits';

  public readonly code = 'CLEAN_METHOD.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(CleanMethodCodeAlreadyExsitError.message, cause, metadata);
  }
}

export class CleanMethodCodeAndOperationCodeAlreadyExistError extends ExceptionBase {
  static readonly message =
    'Clean method code and operation code already exist';

  public readonly code = 'CLEAN.METHOD.CODE.AND.OPERATION.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(
      CleanMethodCodeAndOperationCodeAlreadyExistError.message,
      cause,
      metadata,
    );
  }
}

export class CleanMethodCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Clean method code already in use';

  public readonly code = 'CLEAN_METHOD.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(CleanMethodCodeAlreadyInUseError.message, cause, metadata);
  }
}
