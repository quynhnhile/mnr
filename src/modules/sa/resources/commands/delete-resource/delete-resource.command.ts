export class DeleteResourceCommand {
  readonly resourceId: string;

  constructor(props: DeleteResourceCommand) {
    this.resourceId = props.resourceId;
  }
}
