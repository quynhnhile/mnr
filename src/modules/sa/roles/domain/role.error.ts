import { ExceptionBase } from '@libs/exceptions';
export class RoleAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Role already exists';

  public readonly code = 'ROLE.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(RoleAlreadyExistsError.message, cause, metadata);
  }
}

export class RoleNotFoundError extends ExceptionBase {
  static readonly message = 'Role not found';

  public readonly code = 'ROLE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(RoleNotFoundError.message, cause, metadata);
  }
}
