export class DeleteOperationCommand {
  readonly operationId: bigint;

  constructor(props: DeleteOperationCommand) {
    this.operationId = props.operationId;
  }
}
