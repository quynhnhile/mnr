import { Command, CommandProps } from '@libs/ddd';

export class UpdateVendorCommand extends Command {
  readonly vendorId: bigint;
  readonly operationCode?: string;
  readonly vendorTypeCode?: string;
  readonly vendorCode?: string;
  readonly vendorName?: string;
  readonly isActive?: boolean;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateVendorCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
