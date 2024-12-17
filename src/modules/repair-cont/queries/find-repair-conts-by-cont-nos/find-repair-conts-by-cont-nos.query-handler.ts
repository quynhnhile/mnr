import { Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindRepairContsByContainerNosQuery {
  readonly containerNo: string[];

  constructor(props: FindRepairContsByContainerNosQuery) {
    Object.assign(this, props);
  }
}

export type FindRepairContsByContainerNosQueryResult = Result<
  RepairContEntity[],
  RepairContNotFoundError
>;

@QueryHandler(FindRepairContsByContainerNosQuery)
export class FindRepairContsByContainerNosQueryHandler
  implements IQueryHandler
{
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    query: FindRepairContsByContainerNosQuery,
  ): Promise<FindRepairContsByContainerNosQueryResult> {
    const found = await this.repairContRepo.findRepairContsByContainerNos(
      query,
    );

    return Ok(found);
  }
}
