import { ExceptionBase } from '@libs/exceptions';

export class SysConfigOprNotFoundError extends ExceptionBase {
  static readonly message = 'Sys config opr not found';

  public readonly code = 'SYS_CONFIG_OPR.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(SysConfigOprNotFoundError.message, cause, metadata);
  }
}

export class OperationCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Operation code already exist';

  public readonly code = 'OPERATION.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(OperationCodeAlreadyExistError.message, cause, metadata);
  }
}
