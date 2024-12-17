import { ExceptionBase } from '@libs/exceptions';

export class VendorNotFoundError extends ExceptionBase {
  static readonly message = 'Vendor not found';

  public readonly code = 'VENDOR.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(VendorNotFoundError.message, cause, metadata);
  }
}

export class VendorCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Vendor code already exists';

  public readonly code = 'VENDOR.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(VendorCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class VendorCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Vendor code already in use';

  public readonly code = 'VENDOR.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(VendorCodeAlreadyInUseError.message, cause, metadata);
  }
}
