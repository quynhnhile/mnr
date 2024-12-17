import { ExceptionBase } from '@libs/exceptions';

export class RegionNotFoundError extends ExceptionBase {
  static readonly message = 'Region not found';

  public readonly code = 'REGION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(RegionNotFoundError.message, cause, metadata);
  }
}

export class RegionCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Region code already exists';

  public readonly code = 'REGION.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(RegionCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class RegionCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Region code already in use';

  public readonly code = 'REGION.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(RegionCodeAlreadyInUseError.message, cause, metadata);
  }
}
