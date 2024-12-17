import { ExceptionBase } from '@libs/exceptions';

export class LocationNotFoundError extends ExceptionBase {
  static readonly message = 'Location not found';

  public readonly code = 'LOCATION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(LocationNotFoundError.message, cause, metadata);
  }
}

export class LocationCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Location code already exists';

  public readonly code = 'LOCATION.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(LocationCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class LocationCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Location code already in use';

  public readonly code = 'LOCATION.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(LocationCodeAlreadyInUseError.message, cause, metadata);
  }
}
