import { ExceptionBase } from '@libs/exceptions';

export class RepairNotFoundError extends ExceptionBase {
  static readonly message = 'Repair not found';

  public readonly code = 'REPAIR.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(RepairNotFoundError.message, cause, metadata);
  }
}

export class RepairCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Repair code already exist';

  public readonly code = 'REPAIR.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(RepairCodeAlreadyExistError.message, cause, metadata);
  }
}

export class RepairCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Repair code already in use';

  public readonly code = 'REPAIR.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(RepairCodeAlreadyInUseError.message, cause, metadata);
  }
}
