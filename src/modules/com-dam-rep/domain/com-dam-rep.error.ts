import { ExceptionBase } from '@libs/exceptions';

export class ComDamRepNotFoundError extends ExceptionBase {
  static readonly message = 'Com dam rep not found';

  public readonly code = 'COM_DAM_REP.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ComDamRepNotFoundError.message, cause, metadata);
  }
}

export class ComDamRepAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Com dam rep already exists';

  public readonly code = 'COM_DAM_REP.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ComDamRepAlreadyExistsError.message, cause, metadata);
  }
}
