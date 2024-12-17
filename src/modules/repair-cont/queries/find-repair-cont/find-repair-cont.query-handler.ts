import { Err, Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindRepairContQuery {
  repairContId: bigint;

  constructor(public readonly id: bigint) {
    this.repairContId = id;
  }
}

export type FindRepairContQueryResult = Result<
  RepairContEntity,
  RepairContNotFoundError
>;

@QueryHandler(FindRepairContQuery)
export class FindRepairContQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    query: FindRepairContQuery,
  ): Promise<FindRepairContQueryResult> {
    const found = await this.repairContRepo.findOneById(query.repairContId);
    if (found.isNone()) return Err(new RepairContNotFoundError());

    return Ok(found.unwrap());
  }
}
