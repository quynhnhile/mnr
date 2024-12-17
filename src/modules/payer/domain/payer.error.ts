import { ExceptionBase } from '@libs/exceptions';
export class PayerCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Payer code already exists';

  public readonly code = 'PAYER.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(PayerCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class PayerNotFoundError extends ExceptionBase {
  static readonly message = 'Payer not found';

  public readonly code = 'PAYER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(PayerNotFoundError.message, cause, metadata);
  }
}

export class PayerCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Payer code already in use';

  public readonly code = 'Payer.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(PayerCodeAlreadyInUseError.message, cause, metadata);
  }
}
