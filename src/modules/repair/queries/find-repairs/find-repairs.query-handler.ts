import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import { RepairEntity } from '@modules/repair/domain/repair.entity';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindRepairsQuery extends PrismaPaginatedQueryBase<Prisma.RepairWhereInput> {}

export type FindRepairsQueryResult = Result<Paginated<RepairEntity>, void>;

@QueryHandler(FindRepairsQuery)
export class FindRepairsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPAIR_REPOSITORY)
    protected readonly repairRepo: RepairRepositoryPort,
  ) {}

  async execute(query: FindRepairsQuery): Promise<FindRepairsQueryResult> {
    const result = await this.repairRepo.findAllPaginated(query);

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
