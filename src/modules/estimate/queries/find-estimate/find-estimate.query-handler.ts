import { Err, Ok, Result } from 'oxide.ts';
import { ESTIMATE_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindEstimateQuery {
  estimateId: bigint;
  includeStatistics?: boolean;

  constructor(estimateId: bigint, includeStatistics = false) {
    this.estimateId = estimateId;
    this.includeStatistics = includeStatistics;
  }
}

export type FindEstimateQueryResult = Result<
  EstimateEntity,
  EstimateNotFoundError
>;

@QueryHandler(FindEstimateQuery)
export class FindEstimateQueryHandler implements IQueryHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
  ) {}

  async execute(query: FindEstimateQuery): Promise<FindEstimateQueryResult> {
    const found = await this.estimateRepo.findOneWithStatistics(
      query.estimateId,
      query.includeStatistics,
    );
    if (found.isNone()) return Err(new EstimateNotFoundError());

    return Ok(found.unwrap());
  }
}
