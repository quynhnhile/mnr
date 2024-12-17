export class DeleteDamageLocalCommand {
  readonly damageLocalId: bigint;

  constructor(props: DeleteDamageLocalCommand) {
    this.damageLocalId = props.damageLocalId;
  }
}
