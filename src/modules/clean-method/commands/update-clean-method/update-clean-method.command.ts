import { Command, CommandProps } from '@libs/ddd';

export class UpdateCleanMethodCommand extends Command {
  readonly cleanMethodId: bigint;
  // Add more properties here
  readonly operationCode?: string;
  readonly cleanMethodCode?: string;
  readonly cleanMethodName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateCleanMethodCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
