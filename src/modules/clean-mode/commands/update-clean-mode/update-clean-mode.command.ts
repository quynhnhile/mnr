import { Command, CommandProps } from '@libs/ddd';

export class UpdateCleanModeCommand extends Command {
  readonly cleanModeId: bigint;
  // Add more properties here
  readonly operationCode?: string;
  readonly cleanModeCode?: string;
  readonly cleanModeName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateCleanModeCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
