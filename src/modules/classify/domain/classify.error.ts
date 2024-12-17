import { ExceptionBase } from '@libs/exceptions';

export class ClassifyNotFoundError extends ExceptionBase {
  static readonly message = 'Classify not found';

  public readonly code = 'CLASSIFY.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ClassifyNotFoundError.message, cause, metadata);
  }
}

export class ClassifyCodeAlreadyExsitError extends ExceptionBase {
  static readonly message = 'Classify code already exsits';

  public readonly code = 'CLASSIFY.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ClassifyCodeAlreadyExsitError.message, cause, metadata);
  }
}

export class ClassifyCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Classify code already in use';

  public readonly code = 'CLASSIFY.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ClassifyCodeAlreadyInUseError.message, cause, metadata);
  }
}
