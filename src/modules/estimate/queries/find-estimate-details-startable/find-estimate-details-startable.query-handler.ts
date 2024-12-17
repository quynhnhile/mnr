import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindEstimateDetailsStartableQuery extends PrismaPaginatedQueryBase<Prisma.EstimateDetailWhereInput> {}

export type FindEstimateDetailsStartableQueryResult = Result<
  Paginated<EstimateDetailEntity>,
  void
>;

@QueryHandler(FindEstimateDetailsStartableQuery)
export class FindEstimateDetailsStartableQueryHandler implements IQueryHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    query: FindEstimateDetailsStartableQuery,
  ): Promise<FindEstimateDetailsStartableQueryResult> {
    const result =
      await this.estimateDetailRepo.findAllEstimateDetailsStartableIncludeJob(
        query,
      );

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
