import { Command, CommandProps } from '@libs/ddd';

export class UpdateVendorTypeCommand extends Command {
  readonly vendorTypeId: bigint;
  readonly vendorTypeCode?: string;
  readonly vendorTypeName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateVendorTypeCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
