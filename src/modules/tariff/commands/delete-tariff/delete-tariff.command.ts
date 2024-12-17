export class DeleteTariffCommand {
  readonly tariffId: bigint;

  constructor(props: DeleteTariffCommand) {
    this.tariffId = props.tariffId;
  }
}
