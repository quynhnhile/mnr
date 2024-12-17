import { Err, Ok, Result } from 'oxide.ts';
import { AGENT_REPOSITORY } from '@modules/agent/agent.di-tokens';
import { AgentRepositoryPort } from '@modules/agent/database/agent.repository.port';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAgentCommand } from './create-agent.command';
import { AgentCodeAlreadyExistsError } from '../../domain/agent.error';

export type CreateAgentServiceResult = Result<
  AgentEntity,
  AgentCodeAlreadyExistsError
>;

@CommandHandler(CreateAgentCommand)
export class CreateAgentService implements ICommandHandler {
  constructor(
    @Inject(AGENT_REPOSITORY)
    protected readonly agentRepo: AgentRepositoryPort,
  ) {}

  async execute(
    command: CreateAgentCommand,
  ): Promise<CreateAgentServiceResult> {
    const agent = AgentEntity.create({
      ...command.getExtendedProps<CreateAgentCommand>(),
    });

    try {
      const createdAgent = await this.agentRepo.insert(agent);
      return Ok(createdAgent);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new AgentCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
