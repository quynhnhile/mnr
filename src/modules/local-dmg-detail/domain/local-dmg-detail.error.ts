import { ExceptionBase } from '@libs/exceptions';

export class LocalDmgDetailNotFoundError extends ExceptionBase {
  static readonly message = 'LocalDmgDetail not found';

  public readonly code = 'LOCAL_DMG_DETAIL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(LocalDmgDetailNotFoundError.message, cause, metadata);
  }
}
