import { Ok, Result } from 'oxide.ts';
import { PrismaQueryBase } from '@libs/ddd/prisma-query.base';
import { RegionRepositoryPort } from '@modules/region/database/region.repository.port';
import { RegionEntity } from '@modules/region/domain/region.entity';
import { REGION_REPOSITORY } from '@modules/region/region.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindAllRegionsQuery extends PrismaQueryBase<Prisma.RegionWhereInput> {}
export type FindAllRegionsQueryResult = Result<RegionEntity[], void>;

@QueryHandler(FindAllRegionsQuery)
export class FindAllRegionsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REGION_REPOSITORY)
    protected readonly regionRepo: RegionRepositoryPort,
  ) {}

  async execute(
    query: FindAllRegionsQuery,
  ): Promise<FindAllRegionsQueryResult> {
    const where = query.where || {};
    const regions = await this.regionRepo.findAll({ where });
    return Ok(regions);
  }
}
