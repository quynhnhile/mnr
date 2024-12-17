export class DeleteVendorTypeCommand {
  readonly vendorTypeId: bigint;

  constructor(props: DeleteVendorTypeCommand) {
    this.vendorTypeId = props.vendorTypeId;
  }
}
