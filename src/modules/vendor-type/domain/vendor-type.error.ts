import { ExceptionBase } from '@libs/exceptions';

export class VendorTypeNotFoundError extends ExceptionBase {
  static readonly message = 'Vendor type not found';

  public readonly code = 'VENDOR_TYPE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(VendorTypeNotFoundError.message, cause, metadata);
  }
}

export class VendorTypeCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Vendor type code already exists';

  public readonly code = 'VendorType.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(VendorTypeCodeAlreadyExistsError.message, cause, metadata);
  }
}

export class VendorTypeCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Vendor type code already in use';

  public readonly code = 'VENDOR_TYPE.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(VendorTypeCodeAlreadyInUseError.message, cause, metadata);
  }
}
