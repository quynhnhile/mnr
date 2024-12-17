import { ExceptionBase } from '@libs/exceptions';

export class GroupLocationLocalNotFoundError extends ExceptionBase {
  static readonly message = 'Group location local not found';

  public readonly code = 'GROUP_LOCATION_LOCAL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(GroupLocationLocalNotFoundError.message, cause, metadata);
  }
}

export class GroupLocationLocalCodeAlreadyExistError extends ExceptionBase {
  static readonly message = 'Group location local code already exist';

  public readonly code = 'GROUP_LOCATION_LOCAL.CODE_ALREADY_EXIST';

  constructor(cause?: Error, metadata?: unknown) {
    super(GroupLocationLocalCodeAlreadyExistError.message, cause, metadata);
  }
}

export class GroupLocationLocalCodeAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Group location local code already in use';

  public readonly code = 'GROUP_LOCATION_LOCAL.CODE_ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(GroupLocationLocalCodeAlreadyInUseError.message, cause, metadata);
  }
}
