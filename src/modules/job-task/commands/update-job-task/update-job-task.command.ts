import { Command, CommandProps } from '@libs/ddd';

export class UpdateJobTaskCommand extends Command {
  readonly jobTaskId: bigint;
  readonly jobTaskCode?: string;
  readonly jobTaskName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateJobTaskCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
