import { ExceptionBase } from '@libs/exceptions';

export class LocationLocalNotFoundError extends ExceptionBase {
  static readonly message = 'Location local not found';

  public readonly code = 'LOCATION_LOCAL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(LocationLocalNotFoundError.message, cause, metadata);
  }
}

export class LocationLocalCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Location local code already exists';

  public readonly code = 'LOCATION_LOCAL.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(LocationLocalCodeAlreadyExistsError.message, cause, metadata);
  }
}
