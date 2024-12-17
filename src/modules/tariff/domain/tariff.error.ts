import { ExceptionBase } from '@libs/exceptions';

export class TariffNotFoundError extends ExceptionBase {
  static readonly message = 'Tariff not found';

  public readonly code = 'TARIFF.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(TariffNotFoundError.message, cause, metadata);
  }
}

export class TariffAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Tariff already exists';

  public readonly code = 'TARIFF.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(TariffAlreadyExistsError.message, cause, metadata);
  }
}
