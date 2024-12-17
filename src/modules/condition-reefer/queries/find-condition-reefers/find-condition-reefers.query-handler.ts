import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { CONDITION_REEFER_REPOSITORY } from '@modules/condition-reefer/condition-reefer.di-tokens';
import { ConditionReeferRepositoryPort } from '@modules/condition-reefer/database/condition-reefer.repository.port';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindConditionReefersQuery extends PrismaPaginatedQueryBase<Prisma.ConditionReeferWhereInput> {}

export type FindConditionReefersQueryResult = Result<
  Paginated<ConditionReeferEntity>,
  void
>;

@QueryHandler(FindConditionReefersQuery)
export class FindConditionReefersQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONDITION_REEFER_REPOSITORY)
    protected readonly conditionReeferRepo: ConditionReeferRepositoryPort,
  ) {}

  async execute(
    query: FindConditionReefersQuery,
  ): Promise<FindConditionReefersQueryResult> {
    const result = await this.conditionReeferRepo.findAllPaginated(query);

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
