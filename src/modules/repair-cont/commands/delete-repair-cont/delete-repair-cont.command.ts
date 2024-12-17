export class DeleteRepairContCommand {
  readonly repairContId: bigint;

  constructor(props: DeleteRepairContCommand) {
    this.repairContId = props.repairContId;
  }
}
