import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { RegionRepositoryPort } from '@modules/region/database/region.repository.port';
import { REGION_REPOSITORY } from '@modules/region/region.di-tokens';
import { RegionEntity } from '@modules/region/domain/region.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';

export class FindRegionsQuery extends PrismaPaginatedQueryBase<Prisma.RegionWhereInput> {}

export type FindRegionsQueryResult = Result<Paginated<RegionEntity>, void>;

@QueryHandler(FindRegionsQuery)
export class FindRegionsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REGION_REPOSITORY)
    protected readonly regionRepo: RegionRepositoryPort,
  ) {}

  async execute(query: FindRegionsQuery): Promise<FindRegionsQueryResult> {
    const result = await this.regionRepo.findAllPaginated(query);

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
