import { Err, Ok, Result } from 'oxide.ts';
import { AGENT_REPOSITORY } from '@modules/agent/agent.di-tokens';
import { AgentRepositoryPort } from '@modules/agent/database/agent.repository.port';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import { AgentNotFoundError } from '@modules/agent/domain/agent.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindAgentQuery {
  agentId: bigint;

  constructor(public readonly id: bigint) {
    this.agentId = id;
  }
}

export type FindAgentQueryResult = Result<AgentEntity, AgentNotFoundError>;

@QueryHandler(FindAgentQuery)
export class FindAgentQueryHandler implements IQueryHandler {
  constructor(
    @Inject(AGENT_REPOSITORY)
    protected readonly agentRepo: AgentRepositoryPort,
  ) {}

  async execute(query: FindAgentQuery): Promise<FindAgentQueryResult> {
    const found = await this.agentRepo.findOneById(query.agentId);
    if (found.isNone()) return Err(new AgentNotFoundError());

    return Ok(found.unwrap());
  }
}
