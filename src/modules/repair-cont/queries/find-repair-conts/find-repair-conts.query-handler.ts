import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindRepairContsQuery extends PrismaPaginatedQueryBase<Prisma.RepairContWhereInput> {}

export type FindRepairContsQueryResult = Result<
  Paginated<RepairContEntity>,
  void
>;

@QueryHandler(FindRepairContsQuery)
export class FindRepairContsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    query: FindRepairContsQuery,
  ): Promise<FindRepairContsQueryResult> {
    const result = await this.repairContRepo.findAllPaginated(query);

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
