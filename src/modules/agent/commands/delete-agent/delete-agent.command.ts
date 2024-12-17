export class DeleteAgentCommand {
  readonly agentId: bigint;

  constructor(props: DeleteAgentCommand) {
    this.agentId = props.agentId;
  }
}
