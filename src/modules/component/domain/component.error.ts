import { ExceptionBase } from '@libs/exceptions';

export class ComponentNotFoundError extends ExceptionBase {
  static readonly message = 'Component not found';

  public readonly code = 'COMPONENT.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ComponentNotFoundError.message, cause, metadata);
  }
}

export class ComponentCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Component code already exists';

  public readonly code = 'COMPONENT.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ComponentCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class ComponentCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Component code already in use';

  public readonly code = 'COMPONENT.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ComponentCodeAlreadyInUseError.message, cause, metadata);
  }
}
