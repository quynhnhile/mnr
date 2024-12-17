import { Err, Ok, Result } from 'oxide.ts';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindEstimateDetailQuery {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;

  constructor(estimateId: bigint, estimateDetailId: bigint) {
    this.estimateId = estimateId;
    this.estimateDetailId = estimateDetailId;
  }
}

export type FindEstimateDetailQueryResult = Result<
  EstimateDetailEntity,
  EstimateDetailNotFoundError
>;

@QueryHandler(FindEstimateDetailQuery)
export class FindEstimateDetailQueryHandler implements IQueryHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    query: FindEstimateDetailQuery,
  ): Promise<FindEstimateDetailQueryResult> {
    const found = await this.estimateDetailRepo.getOneById(
      query.estimateDetailId,
    );
    if (found.isNone()) return Err(new EstimateDetailNotFoundError());

    return Ok(found.unwrap());
  }
}
