import { ExceptionBase } from '@libs/exceptions';

export class DamageLocalNotFoundError extends ExceptionBase {
  static readonly message = 'Damage local not found';

  public readonly code = 'DAMAGE_LOCAL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(DamageLocalNotFoundError.message, cause, metadata);
  }
}

export class DamageLocalCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Damage local code already exist';

  public readonly code = 'DAMAGE.LOCAL.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(DamageLocalCodeAlreadyExistError.message, cause, metadata);
  }
}
