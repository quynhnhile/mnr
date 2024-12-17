export class DeletePayerCommand {
  readonly payerId: bigint;

  constructor(props: DeletePayerCommand) {
    this.payerId = props.payerId;
  }
}
