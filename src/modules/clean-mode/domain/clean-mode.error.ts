import { ExceptionBase } from '@libs/exceptions';

export class CleanModeNotFoundError extends ExceptionBase {
  static readonly message = 'Clean mode not found';

  public readonly code = 'CLEAN_MODE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(CleanModeNotFoundError.message, cause, metadata);
  }
}

export class CleanModeCodeAlreadyExsitError extends ExceptionBase {
  static readonly message = 'Clean mode code already exsits';

  public readonly code = 'CLEAN_MODE.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(CleanModeCodeAlreadyExsitError.message, cause, metadata);
  }
}

export class CleanModeCodeAndOperationCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Clean mode code and operation code already exist';

  public readonly code = 'CLEAN.MODE.CODE.AND.OPERATION.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(
      CleanModeCodeAndOperationCodeAlreadyExistError.message,
      cause,
      metadata,
    );
  }
}

export class CleanModeCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Clean mode code already in use';

  public readonly code = 'CLEAN_MODE.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(CleanModeCodeAlreadyInUseError.message, cause, metadata);
  }
}
