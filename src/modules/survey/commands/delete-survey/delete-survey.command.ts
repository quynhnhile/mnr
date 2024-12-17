export class DeleteSurveyCommand {
  readonly surveyId: bigint;

  constructor(props: DeleteSurveyCommand) {
    this.surveyId = props.surveyId;
  }
}
