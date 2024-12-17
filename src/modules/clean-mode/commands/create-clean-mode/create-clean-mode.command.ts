import { Command, CommandProps } from '@libs/ddd';

export class CreateCleanModeCommand extends Command {
  // Add more properties here
  readonly operationCode: string;
  readonly cleanModeCode: string;
  readonly cleanModeName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateCleanModeCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
