import { Command, CommandProps } from '@libs/ddd';

export class UpdateOperationCommand extends Command {
  readonly tariffGroupId: bigint;
  // Add more properties here
  readonly operationCode?: string[] | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateOperationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
