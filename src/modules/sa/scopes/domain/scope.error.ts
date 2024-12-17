import { ExceptionBase } from '@libs/exceptions';

export class ScopeNotFoundError extends ExceptionBase {
  static readonly message = 'Scope not found';

  public readonly code = 'SCOPE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ScopeNotFoundError.message, cause, metadata);
  }
}
