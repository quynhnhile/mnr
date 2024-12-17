import { ExceptionBase } from '@libs/exceptions';

export class ContSizeMapNotFoundError extends ExceptionBase {
  static readonly message = 'Cont size map not found';

  public readonly code = 'CONT_SIZE_MAP.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ContSizeMapNotFoundError.message, cause, metadata);
  }
}

export class ContSizeMapCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Cont size map code already exists';

  public readonly code = 'CONT_SIZE_MAP.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ContSizeMapCodeAlreadyExistsError.message, cause, metadata);
  }
}
