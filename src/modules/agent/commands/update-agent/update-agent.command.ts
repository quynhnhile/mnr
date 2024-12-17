import { Command, CommandProps } from '@libs/ddd';

export class UpdateAgentCommand extends Command {
  readonly agentId: bigint;
  readonly operationCode?: string;
  readonly operationName?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateAgentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
