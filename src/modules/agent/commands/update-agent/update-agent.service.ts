import { Err, Ok, Result } from 'oxide.ts';
import { AGENT_REPOSITORY } from '@modules/agent/agent.di-tokens';
import { AgentRepositoryPort } from '@modules/agent/database/agent.repository.port';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import {
  AgentCodeAlreadyExistsError,
  AgentNotFoundError,
} from '@modules/agent/domain/agent.error';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAgentCommand } from './update-agent.command';

export type UpdateAgentServiceResult = Result<
  AgentEntity,
  AgentNotFoundError | AgentCodeAlreadyExistsError
>;

@CommandHandler(UpdateAgentCommand)
export class UpdateAgentService implements ICommandHandler {
  constructor(
    @Inject(AGENT_REPOSITORY)
    protected readonly agentRepo: AgentRepositoryPort,
  ) {}

  async execute(
    command: UpdateAgentCommand,
  ): Promise<UpdateAgentServiceResult> {
    const found = await this.agentRepo.findOneById(command.agentId);
    if (found.isNone()) {
      return Err(new AgentNotFoundError());
    }

    const agent = found.unwrap();
    agent.update({
      ...command.getExtendedProps<UpdateAgentCommand>(),
    });

    try {
      const updatedAgent = await this.agentRepo.update(agent);
      return Ok(updatedAgent);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new AgentCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
