import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { AGENT_REPOSITORY } from '@modules/agent/agent.di-tokens';
import { AgentRepositoryPort } from '@modules/agent/database/agent.repository.port';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import { AgentNotFoundError } from '@modules/agent/domain/agent.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAgentCommand } from './delete-agent.command';

export type DeleteAgentServiceResult = Result<boolean, AgentNotFoundError>;

@CommandHandler(DeleteAgentCommand)
export class DeleteAgentService implements ICommandHandler {
  constructor(
    @Inject(AGENT_REPOSITORY)
    protected readonly agentRepo: AgentRepositoryPort,
  ) {}

  async execute(
    command: DeleteAgentCommand,
  ): Promise<DeleteAgentServiceResult> {
    try {
      const result = await this.agentRepo.delete({
        id: command.agentId,
      } as AgentEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new AgentNotFoundError(error));
      }

      throw error;
    }
  }
}
