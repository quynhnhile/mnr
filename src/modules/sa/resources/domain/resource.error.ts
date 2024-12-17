import { ExceptionBase } from '@libs/exceptions';
export class ResourceAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Resource already exists';

  public readonly code = 'RESOURCE.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ResourceAlreadyExistsError.message, cause, metadata);
  }
}

export class ResourceNotFoundError extends ExceptionBase {
  static readonly message = 'Resource not found';

  public readonly code = 'RESOURCE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ResourceNotFoundError.message, cause, metadata);
  }
}
