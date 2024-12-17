export class DeleteVendorCommand {
  readonly vendorId: bigint;

  constructor(props: DeleteVendorCommand) {
    this.vendorId = props.vendorId;
  }
}
