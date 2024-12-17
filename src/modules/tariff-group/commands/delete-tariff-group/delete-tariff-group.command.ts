export class DeleteTariffGroupCommand {
  readonly tariffGroupId: bigint;

  constructor(props: DeleteTariffGroupCommand) {
    this.tariffGroupId = props.tariffGroupId;
  }
}
