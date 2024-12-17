import { Err, Ok, Result } from 'oxide.ts';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import { RepairEntity } from '@modules/repair/domain/repair.entity';
import { RepairNotFoundError } from '@modules/repair/domain/repair.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindRepairQuery {
  repairId: bigint;

  constructor(public readonly id: bigint) {
    this.repairId = id;
  }
}

export type FindRepairQueryResult = Result<RepairEntity, RepairNotFoundError>;

@QueryHandler(FindRepairQuery)
export class FindRepairQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPAIR_REPOSITORY)
    protected readonly repairRepo: RepairRepositoryPort,
  ) {}

  async execute(query: FindRepairQuery): Promise<FindRepairQueryResult> {
    const found = await this.repairRepo.findOneById(query.repairId);
    if (found.isNone()) return Err(new RepairNotFoundError());

    return Ok(found.unwrap());
  }
}
