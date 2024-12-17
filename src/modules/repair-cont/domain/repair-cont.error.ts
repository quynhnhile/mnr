import { ExceptionBase } from '@libs/exceptions';

export class RepairContNotFoundError extends ExceptionBase {
  static readonly message = 'Repair cont not found';

  public readonly code = 'REPAIR_CONT.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(RepairContNotFoundError.message, cause, metadata);
  }
}
