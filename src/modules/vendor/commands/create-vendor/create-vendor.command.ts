import { Command, CommandProps } from '@libs/ddd';

export class CreateVendorCommand extends Command {
  readonly operationCode?: string;
  readonly vendorTypeCode: string;
  readonly vendorCode: string;
  readonly vendorName: string;
  readonly isActive?: boolean;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateVendorCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
