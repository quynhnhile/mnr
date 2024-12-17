import { Command, CommandProps } from '@libs/ddd';

export class CreateAgentCommand extends Command {
  readonly operationCode: string;
  readonly agentCode: string;
  readonly agentName: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateAgentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
