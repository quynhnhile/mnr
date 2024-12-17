import { Command, CommandProps } from '@libs/ddd';

export class CreateCleanMethodCommand extends Command {
  // Add more properties here
  readonly operationCode: string;
  readonly cleanMethodCode: string;
  readonly cleanMethodName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateCleanMethodCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
