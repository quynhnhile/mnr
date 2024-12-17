import { ExceptionBase } from '@libs/exceptions';

export class JobRepairCleanNotFoundError extends ExceptionBase {
  static readonly message = 'Job repair clean not found';

  public readonly code = 'JOB_REPAIR_CLEAN.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobRepairCleanNotFoundError.message, cause, metadata);
  }
}

export class JobRepairCleanAlreadyStartedError extends ExceptionBase {
  static readonly message = 'Job repair clean already started';

  public readonly code = 'JOB_REPAIR_CLEAN.ALREADY_STARTED';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobRepairCleanAlreadyStartedError.message, cause, metadata);
  }
}

export class AllJobRepairCleanAlreadyStartedError extends ExceptionBase {
  static readonly message = 'All job repair clean already started';

  public readonly code = 'ALL_JOB_REPAIR_CLEAN.ALREADY_STARTED';

  constructor(cause?: Error, metadata?: unknown) {
    super(AllJobRepairCleanAlreadyStartedError.message, cause, metadata);
  }
}

export class JobRepairCleanAlreadyFinishedError extends ExceptionBase {
  static readonly message = 'Job repair clean already finished';

  public readonly code = 'JOB_REPAIR_CLEAN.ALREADY_FINISHED';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobRepairCleanAlreadyFinishedError.message, cause, metadata);
  }
}

export class JobRepairCleanAlreadyStartedOrCanceledError extends ExceptionBase {
  static readonly message = 'Job repair clean already started or canceled';

  public readonly code = 'JOB_REPAIR_CLEAN.ALREADY_STARTED_OR_CANCELED';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobRepairCleanAlreadyStartedOrCanceledError.message, cause, metadata);
  }
}

export class JobRepairCleanAlreadyCompletedError extends ExceptionBase {
  static readonly message = 'Job repair clean already completed';

  public readonly code = 'JOB_REPAIR_CLEAN.ALREADY_COMPLETED';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobRepairCleanAlreadyCompletedError.message, cause, metadata);
  }
}
