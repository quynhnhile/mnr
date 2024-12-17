import { Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import {
  ContNosResult,
  RepairContRepositoryPort,
} from '@modules/repair-cont/database/repair-cont.repository.port';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class QueryContByContainerNosQuery {
  readonly containerNo: string[];

  constructor(props: QueryContByContainerNosQuery) {
    Object.assign(this, props);
  }
}

export type QueryContByContainerNosQueryResult = Result<ContNosResult[], Error>;

@QueryHandler(QueryContByContainerNosQuery)
export class QueryContByContNosQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    query: QueryContByContainerNosQuery,
  ): Promise<QueryContByContainerNosQueryResult> {
    const found = await this.repairContRepo.QueryContByContNos(query);
    console.log('check found: ', found);
    return Ok(found);
  }
}
