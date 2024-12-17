import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { AGENT_REPOSITORY } from '@modules/agent/agent.di-tokens';
import { AgentRepositoryPort } from '@modules/agent/database/agent.repository.port';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';

export class FindAgentsQuery extends PrismaPaginatedQueryBase<Prisma.AgentWhereInput> {}

export type FindAgentsQueryResult = Result<Paginated<AgentEntity>, void>;

@QueryHandler(FindAgentsQuery)
export class FindAgentsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(AGENT_REPOSITORY)
    protected readonly agentRepo: AgentRepositoryPort,
  ) {}

  async execute(query: FindAgentsQuery): Promise<FindAgentsQueryResult> {
    const result = await this.agentRepo.findAllPaginated(query);

    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
