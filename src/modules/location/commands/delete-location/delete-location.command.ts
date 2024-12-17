export class DeleteLocationCommand {
  readonly locationId: bigint;

  constructor(props: DeleteLocationCommand) {
    this.locationId = props.locationId;
  }
}
