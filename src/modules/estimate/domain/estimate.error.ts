import { ExceptionBase } from '@libs/exceptions';

export class EstimateNotFoundError extends ExceptionBase {
  static readonly message = 'Estimate not found';

  public readonly code = 'ESTIMATE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateNotFoundError.message, cause, metadata);
  }
}

export class EstimateAlreadyLocalApprovedError extends ExceptionBase {
  static readonly message = 'Estimate status already local approved';

  public readonly code = 'ESTIMATE.ALREADY_LOCAL_APPROVED';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateAlreadyLocalApprovedError.message, cause, metadata);
  }
}

export class EstimateAlreadySentOperationError extends ExceptionBase {
  static readonly message = 'Estimate already sent operation';

  public readonly code = 'ESTIMATE.ALREADY_SENT_OPERATION';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateAlreadySentOperationError.message, cause, metadata);
  }
}

export class EstimateAlreadyApprovedError extends ExceptionBase {
  static readonly message = 'Estimate already approved';

  public readonly code = 'ESTIMATE.ALREADY_APPROVED';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateAlreadyApprovedError.message, cause, metadata);
  }
}

export class EstimateAlreadyCanceledError extends ExceptionBase {
  static readonly message = 'Estimate already canceled';

  public readonly code = 'ESTIMATE.ALREADY_CANCELED';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateAlreadyCanceledError.message, cause, metadata);
  }
}

export class EstimateAlreadyRequestedActiveError extends ExceptionBase {
  static readonly message = 'Estimate already requested active';

  public readonly code = 'ESTIMATE.ALREADY_REQUESTED_ACTIVE';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateAlreadyRequestedActiveError.message, cause, metadata);
  }
}

export class EstimateIsNotAvailableToCompleteAllError extends ExceptionBase {
  static readonly message = 'Estimate is not available to complete all';

  public readonly code = 'ESTIMATE.IS_NOT_AVAILABAL_TO_cOMPLETE_ALL';

  constructor(cause?: Error, metadata?: unknown) {
    super(EstimateIsNotAvailableToCompleteAllError.message, cause, metadata);
  }
}

export class AllEstimateDetailCanNotStartError extends ExceptionBase {
  static readonly message = 'All estimate detail can not start';

  public readonly code = 'ALL_ESTIMATE_DETAIL.CAN_NOT_START';

  constructor(cause?: Error, metadata?: unknown) {
    super(AllEstimateDetailCanNotStartError.message, cause, metadata);
  }
}

export class AllEstimateDetailAlreadyApprovedError extends ExceptionBase {
  static readonly message = 'All estimate detail already approved';

  public readonly code = 'ALL_ESTIMATE_DETAIL.ALREADY_APPROVED';

  constructor(cause?: Error, metadata?: unknown) {
    super(AllEstimateDetailAlreadyApprovedError.message, cause, metadata);
  }
}

export class AllEstimateDetailAlreadyLocalApprovedError extends ExceptionBase {
  static readonly message = 'All estimate detail already local approved';

  public readonly code = 'ALL_ESTIMATE_DETAIL.ALREADY_LCOAL_APPROVED';

  constructor(cause?: Error, metadata?: unknown) {
    super(AllEstimateDetailAlreadyLocalApprovedError.message, cause, metadata);
  }
}

export class AllEstimateDetailAlreadyCanceledError extends ExceptionBase {
  static readonly message = 'All estimate detail already canceled';

  public readonly code = 'ALL_ESTIMATE_DETAIL.ALREADY_CANCELED';

  constructor(cause?: Error, metadata?: unknown) {
    super(AllEstimateDetailAlreadyCanceledError.message, cause, metadata);
  }
}

export class AllEstimateDetailAlreadyRequestedActiveError extends ExceptionBase {
  static readonly message = 'All estimate detail already requested active';

  public readonly code = 'ALL_ESTIMATE_DETAIL.ALREADY_REQUESTED_ACTIVE';

  constructor(cause?: Error, metadata?: unknown) {
    super(
      AllEstimateDetailAlreadyRequestedActiveError.message,
      cause,
      metadata,
    );
  }
}

export class AllEstimateDetailAlreadySendOprError extends ExceptionBase {
  static readonly message = 'All estimate detail already send opr';

  public readonly code = 'ALL_ESTIMATE_DETAIL.ALREADY_SEND_OPR';

  constructor(cause?: Error, metadata?: unknown) {
    super(AllEstimateDetailAlreadySendOprError.message, cause, metadata);
  }
}
