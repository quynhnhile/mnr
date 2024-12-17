export class DeleteConditionCommand {
  readonly conditionId: bigint;

  constructor(props: DeleteConditionCommand) {
    this.conditionId = props.conditionId;
  }
}
