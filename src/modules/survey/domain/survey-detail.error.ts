import { ExceptionBase } from '@libs/exceptions';

export class SurveyDetailNotFoundError extends ExceptionBase {
  static readonly message = 'SurveyDetail not found';

  public readonly code = 'SURVEY_DETAIL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(SurveyDetailNotFoundError.message, cause, metadata);
  }
}
