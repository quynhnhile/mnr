export class DeleteSymbolCommand {
  readonly symbolId: bigint;

  constructor(props: DeleteSymbolCommand) {
    this.symbolId = props.symbolId;
  }
}
