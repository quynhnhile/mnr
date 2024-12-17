export class DeleteLocalDmgDetailCommand {
  readonly localDmgDetailId: bigint;

  constructor(props: DeleteLocalDmgDetailCommand) {
    this.localDmgDetailId = props.localDmgDetailId;
  }
}
