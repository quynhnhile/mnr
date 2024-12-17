import { Command, CommandProps } from '@libs/ddd';

export class FinishJobRepairCleanCommand extends Command {
  readonly jobRepairCleanId: bigint;
  readonly finishBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<FinishJobRepairCleanCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
