import { ExceptionBase } from '@libs/exceptions';

export class SurveyNotFoundError extends ExceptionBase {
  static readonly message = 'Survey not found';

  public readonly code = 'SURVEY.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(SurveyNotFoundError.message, cause, metadata);
  }
}
