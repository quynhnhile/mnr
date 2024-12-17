import { Command, CommandProps } from '@libs/ddd';

export class CancelJobRepairCleanItemCommand extends Command {
  readonly estimateDetailId: bigint;
  readonly vendorCode?: string | null;
  readonly cancelBy: string;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CancelJobRepairCleanItemCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
