export class DeleteContainerCommand {
  readonly containerId: bigint;

  constructor(props: DeleteContainerCommand) {
    this.containerId = props.containerId;
  }
}
