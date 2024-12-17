export class DeleteTerminalCommand {
  readonly terminalId: bigint;

  constructor(props: DeleteTerminalCommand) {
    this.terminalId = props.terminalId;
  }
}
