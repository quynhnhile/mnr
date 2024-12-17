import { ExceptionBase } from '@libs/exceptions';

export class InvalidTokenError extends ExceptionBase {
  static readonly message = 'Invalid token';

  public readonly code = 'INVALID_TOKEN';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidTokenError.message, cause, metadata);
  }
}
