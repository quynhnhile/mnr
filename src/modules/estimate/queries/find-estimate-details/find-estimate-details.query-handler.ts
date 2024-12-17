import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindEstimateDetailsQuery extends PrismaPaginatedQueryBase<Prisma.EstimateDetailWhereInput> {}

export type FindEstimateDetailsQueryResult = Result<
  Paginated<EstimateDetailEntity>,
  void
>;

@QueryHandler(FindEstimateDetailsQuery)
export class FindEstimateDetailsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    query: FindEstimateDetailsQuery,
  ): Promise<FindEstimateDetailsQueryResult> {
    const result =
      await this.estimateDetailRepo.findAllEstimateDetailsIncludeJob(query);

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
