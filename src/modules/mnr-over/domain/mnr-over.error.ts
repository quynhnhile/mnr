import { ExceptionBase } from '@libs/exceptions';

export class MnrOverNotFoundError extends ExceptionBase {
  static readonly message = 'Mnr Over not found';

  public readonly code = 'MNR_OVER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(MnrOverNotFoundError.message, cause, metadata);
  }
}

export class MnrOverCodeAlreadyExsitError extends ExceptionBase {
  static readonly message = 'Mnr Over code already exsits';

  public readonly code = 'MNR_OVER.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(MnrOverCodeAlreadyExsitError.message, cause, metadata);
  }
}
