export class DeleteCleanMethodCommand {
  readonly cleanMethodId: bigint;

  constructor(props: DeleteCleanMethodCommand) {
    this.cleanMethodId = props.cleanMethodId;
  }
}
