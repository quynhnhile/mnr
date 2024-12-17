import { Command, CommandProps } from '@libs/ddd';

export class CreateJobTaskCommand extends Command {
  // Add more properties here
  readonly jobTaskCode: string;
  readonly jobTaskName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateJobTaskCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
