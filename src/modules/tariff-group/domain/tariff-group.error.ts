import { ExceptionBase } from '@libs/exceptions';

export class TariffGroupNotFoundError extends ExceptionBase {
  static readonly message = 'Tariff group not found';

  public readonly code = 'TARIFF_GROUP.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(TariffGroupNotFoundError.message, cause, metadata);
  }
}

export class TariffGroupCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Tariff group code already exist';

  public readonly code = 'TARIFF_GROUP.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(TariffGroupCodeAlreadyExistError.message, cause, metadata);
  }
}

export class TariffGroupCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Tariff group code already in use';

  public readonly code = 'TARIFF_GROUP.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(TariffGroupCodeAlreadyInUseError.message, cause, metadata);
  }
}
