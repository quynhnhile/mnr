import { ExceptionBase } from '@libs/exceptions';

export class ConditionReeferNotFoundError extends ExceptionBase {
  static readonly message = 'Condition reefer not found';

  public readonly code = 'CONDITION_REEFER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ConditionReeferNotFoundError.message, cause, metadata);
  }
}

export class ConditionReeferCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Condition reefer code already exists';

  public readonly code = 'CONDITION_REEFER.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ConditionReeferCodeAlreadyExistsError.message, cause, metadata);
  }
}
