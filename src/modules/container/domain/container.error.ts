import { ExceptionBase } from '@libs/exceptions';
export class ContainerCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Container code already exists';

  public readonly code = 'CONTAINER.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ContainerCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class ContainerNotFoundError extends ExceptionBase {
  static readonly message = 'Container not found';

  public readonly code = 'CONTAINER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ContainerNotFoundError.message, cause, metadata);
  }
}
