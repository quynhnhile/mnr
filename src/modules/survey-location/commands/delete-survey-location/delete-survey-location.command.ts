export class DeleteSurveyLocationCommand {
  readonly surveyLocationId: bigint;

  constructor(props: DeleteSurveyLocationCommand) {
    this.surveyLocationId = props.surveyLocationId;
  }
}
