export class DeleteLocationLocalCommand {
  readonly locationLocalId: bigint;

  constructor(props: DeleteLocationLocalCommand) {
    this.locationLocalId = props.locationLocalId;
  }
}
