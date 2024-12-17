import { ExceptionBase } from '@libs/exceptions';

export class AgentNotFoundError extends ExceptionBase {
  static readonly message = 'Agent not found';

  public readonly code = 'AGENT.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(AgentNotFoundError.message, cause, metadata);
  }
}

export class AgentCodeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Agent code already exists';

  public readonly code = 'AGENT.CODE_ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(AgentCodeAlreadyExistsError.message, cause, metadata);
  }
}
