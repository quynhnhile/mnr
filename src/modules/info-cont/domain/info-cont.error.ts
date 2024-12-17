import { ExceptionBase } from '@libs/exceptions';

export class InfoContNotFoundError extends ExceptionBase {
  static readonly message = 'InfoCont not found';

  public readonly code = 'INFO_CONT.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(InfoContNotFoundError.message, cause, metadata);
  }
}
