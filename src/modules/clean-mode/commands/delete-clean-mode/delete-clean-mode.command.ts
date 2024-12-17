export class DeleteCleanModeCommand {
  readonly cleanModeId: bigint;

  constructor(props: DeleteCleanModeCommand) {
    this.cleanModeId = props.cleanModeId;
  }
}
