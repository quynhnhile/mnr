export class DeleteSurveyDetailCommand {
  readonly surveyDetailId: bigint;

  constructor(props: DeleteSurveyDetailCommand) {
    this.surveyDetailId = props.surveyDetailId;
  }
}
