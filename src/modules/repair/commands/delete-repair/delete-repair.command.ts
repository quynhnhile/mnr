export class DeleteRepairCommand {
  readonly repairId: bigint;

  constructor(props: DeleteRepairCommand) {
    this.repairId = props.repairId;
  }
}
