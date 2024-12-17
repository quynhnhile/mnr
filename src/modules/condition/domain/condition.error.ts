import { ExceptionBase } from '@libs/exceptions';

export class ConditionNotFoundError extends ExceptionBase {
  static readonly message = 'Condition not found';

  public readonly code = 'CONDITION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ConditionNotFoundError.message, cause, metadata);
  }
}

export class ConditionCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Condition code already exists';

  public readonly code = 'CONDITION.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ConditionCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class ConditionCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Condition code already in use';

  public readonly code = 'CONDITION.CODE_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ConditionCodeAlreadyInUseError.message, cause, metadata);
  }
}
