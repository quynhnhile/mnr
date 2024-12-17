import { Command, CommandProps } from '@libs/ddd';

export class UpdateJobRepairCleanCommand extends Command {
  readonly jobRepairCleanId: bigint;
  // Add more properties here
  readonly repCode?: string | null;
  readonly vendorCode?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateJobRepairCleanCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
