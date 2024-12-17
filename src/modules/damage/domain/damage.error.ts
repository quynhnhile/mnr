import { ExceptionBase } from '@libs/exceptions';

export class DamageNotFoundError extends ExceptionBase {
  static readonly message = 'Damage not found';

  public readonly code = 'DAMAGE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(DamageNotFoundError.message, cause, metadata);
  }
}

export class DamageCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Damage code already exist';

  public readonly code = 'DAMAGE.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(DamageCodeAlreadyExistError.message, cause, metadata);
  }
}

export class DamageCodeAndOperationCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Damage code and operation code already exist';

  public readonly code = 'DAMAGE.CODE.AND.OPERATION.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(DamageCodeAndOperationCodeAlreadyExistError.message, cause, metadata);
  }
}

export class DamageCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Damage code already in use';

  public readonly code = 'DAMAGE.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(DamageCodeAlreadyInUseError.message, cause, metadata);
  }
}
