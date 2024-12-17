import { Command, CommandProps } from '@libs/ddd';

export class CreateVendorTypeCommand extends Command {
  readonly vendorTypeCode: string;
  readonly vendorTypeName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateVendorTypeCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
