export class DeleteDamageCommand {
  readonly damageId: bigint;

  constructor(props: DeleteDamageCommand) {
    this.damageId = props.damageId;
  }
}
