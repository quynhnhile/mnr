export class DeleteEstimateDetailCommand {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;

  constructor(props: DeleteEstimateDetailCommand) {
    this.estimateId = props.estimateId;
    this.estimateDetailId = props.estimateDetailId;
  }
}
