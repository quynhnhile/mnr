import { Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import {
  QueryInfoContByContainerNoOrEstimateNoResult,
  RepairContRepositoryPort,
} from '@modules/repair-cont/database/repair-cont.repository.port';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class QueryInfoContByContainerNoOrEstimateNoQuery {
  readonly containerNo?: string;
  readonly estimateNo?: string;

  constructor(props: QueryInfoContByContainerNoOrEstimateNoQuery) {
    Object.assign(this, props);
  }
}

export type QueryInfoContByContainerNoOrEstimateNoQueryResult = Result<
  QueryInfoContByContainerNoOrEstimateNoResult,
  void
>;

@QueryHandler(QueryInfoContByContainerNoOrEstimateNoQuery)
export class QueryInfoContByContNoOrEstimateNoQueryHandler
  implements IQueryHandler
{
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    query: QueryInfoContByContainerNoOrEstimateNoQuery,
  ): Promise<QueryInfoContByContainerNoOrEstimateNoQueryResult> {
    const result = await this.repairContRepo.QueryInfoContainer({
      containerNo: query.containerNo,
      estimateNo: query.estimateNo,
    });

    if (!result) {
      throw new Error('No container information found.');
    }

    return Ok(result);
  }
}
