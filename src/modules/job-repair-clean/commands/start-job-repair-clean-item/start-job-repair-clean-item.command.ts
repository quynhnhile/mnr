import { Command, CommandProps } from '@libs/ddd';

export class StartJobRepairCleanItemCommand extends Command {
  readonly estimateDetailId: bigint;
  readonly vendorCode?: string | null;
  readonly startBy: string;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<StartJobRepairCleanItemCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
