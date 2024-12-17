import { ExceptionBase } from '@libs/exceptions';

export class EstimateDetailNotFoundError extends ExceptionBase {
  static readonly message = 'Estimate detail not found';

  public readonly code = 'ESTIMATE_DETAIL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateDetailNotFoundError.message, cause, metadata);
  }
}

export class EstimateDetailRequiredFieldError extends ExceptionBase {
  static readonly message =
    'Estimate detail require hours, laborRate, laborPrice, matePrice and total';

  public readonly code =
    'ESTIMATE_DETAIL.REQUIRED_HOURS_LABORRATE_LABORPRICE_MATEPRICE_AND_TOTAL';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateDetailRequiredFieldError.message, cause, metadata);
  }
}

export class EstimateDetailCanNotStartError extends ExceptionBase {
  static readonly message = 'Estimate detail can not start';

  public readonly code = 'ESTIMATE_DETAIL.CAN_NOT_START';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateDetailCanNotStartError.message, cause, metadata);
  }
}
