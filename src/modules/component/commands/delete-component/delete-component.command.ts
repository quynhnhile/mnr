export class DeleteComponentCommand {
  readonly componentId: bigint;

  constructor(props: DeleteComponentCommand) {
    this.componentId = props.componentId;
  }
}
