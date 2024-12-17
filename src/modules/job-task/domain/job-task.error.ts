import { ExceptionBase } from '@libs/exceptions';

export class JobTaskNotFoundError extends ExceptionBase {
  static readonly message = 'Job Task not found';

  public readonly code = 'JOB_TASK.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobTaskNotFoundError.message, cause, metadata);
  }
}

export class JobTaskCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Job Task code already exists';

  public readonly code = 'JOB_TASK.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobTaskCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class JobTaskCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Job Task code already in use';

  public readonly code = 'JOB_TASK.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(JobTaskCodeAlreadyInUseError.message, cause, metadata);
  }
}
