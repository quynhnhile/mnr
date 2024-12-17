import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { ESTIMATE_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindEstimatesQuery extends PrismaPaginatedQueryBase<Prisma.EstimateWhereInput> {}

export type FindEstimatesQueryResult = Result<Paginated<EstimateEntity>, void>;

@QueryHandler(FindEstimatesQuery)
export class FindEstimatesQueryHandler implements IQueryHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
  ) {}

  async execute(query: FindEstimatesQuery): Promise<FindEstimatesQueryResult> {
    const result = await this.estimateRepo.findAllPaginated(query);

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
