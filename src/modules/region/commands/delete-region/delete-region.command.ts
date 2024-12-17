export class DeleteRegionCommand {
  readonly regionId: bigint;

  constructor(props: DeleteRegionCommand) {
    this.regionId = props.regionId;
  }
}
