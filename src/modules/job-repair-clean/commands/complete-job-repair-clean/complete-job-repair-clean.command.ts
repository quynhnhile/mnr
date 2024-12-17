import { Command, CommandProps } from '@libs/ddd';

export class CompleteJobRepairCleanCommand extends Command {
  readonly jobRepairCleanId: bigint;
  readonly completeBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<CompleteJobRepairCleanCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
