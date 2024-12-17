import { Command, CommandProps } from '@libs/ddd';

export class StartAllJobCommand extends Command {
  readonly estimateId: bigint;
  readonly vendorCode?: string | null;
  readonly startBy: string;

  readonly createdBy: string;

  constructor(props: CommandProps<StartAllJobCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
