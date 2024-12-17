import { ExceptionBase } from '@libs/exceptions';

export class SurveyLocationNotFoundError extends ExceptionBase {
  static readonly message = 'SurveyLocation not found';

  public readonly code = 'SURVEY_LOCATION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(SurveyLocationNotFoundError.message, cause, metadata);
  }
}
