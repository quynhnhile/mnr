export class DeleteEstimateCommand {
  readonly estimateId: bigint;

  constructor(props: DeleteEstimateCommand) {
    this.estimateId = props.estimateId;
  }
}
