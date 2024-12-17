export class DeleteStatusTypeCommand {
  readonly statusTypeId: bigint;

  constructor(props: DeleteStatusTypeCommand) {
    this.statusTypeId = props.statusTypeId;
  }
}
