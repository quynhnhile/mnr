import { Err, Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindRepairContByContainerNoQuery {
  constructor(public readonly containerNo: string) {
    this.containerNo = containerNo;
  }
}

export type FindRepairContByContainerNoQueryResult = Result<
  RepairContEntity,
  RepairContNotFoundError
>;

@QueryHandler(FindRepairContByContainerNoQuery)
export class FindRepairContByContainerNoQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    query: FindRepairContByContainerNoQuery,
  ): Promise<FindRepairContByContainerNoQueryResult> {
    const found = await this.repairContRepo.findOneByContainerNo(
      query.containerNo,
    );
    if (found.isNone()) return Err(new RepairContNotFoundError());

    return Ok(found.unwrap());
  }
}
