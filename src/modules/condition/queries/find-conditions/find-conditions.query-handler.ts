import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { CONDITION_REPOSITORY } from '@modules/condition/condition.di-tokens';
import { ConditionRepositoryPort } from '@modules/condition/database/condition.repository.port';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindConditionsQuery extends PrismaPaginatedQueryBase<Prisma.ConditionWhereInput> {}

export type FindConditionsQueryResult = Result<
  Paginated<ConditionEntity>,
  void
>;

@QueryHandler(FindConditionsQuery)
export class FindConditionsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONDITION_REPOSITORY)
    protected readonly conditionRepo: ConditionRepositoryPort,
  ) {}

  async execute(
    query: FindConditionsQuery,
  ): Promise<FindConditionsQueryResult> {
    const result = await this.conditionRepo.findAllPaginated(query);

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
