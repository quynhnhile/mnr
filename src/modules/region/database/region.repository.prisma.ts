import { None, Option, Some } from 'oxide.ts';
import { Injectable } from '@nestjs/common';
import { Prisma, Region as RegionModel } from '@prisma/client';
import { PrismaMultiTenantRepositoryBase } from '@src/libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@src/libs/prisma/prisma-client-manager';
import { RegionEntity } from '../domain/region.entity';
import { RegionMapper } from '../mappers/region.mapper';
import { RegionRepositoryPort } from './region.repository.port';

export const RegionScalarFieldEnum = Prisma.RegionScalarFieldEnum;

@Injectable()
export class PrismaRegionRepository
  extends PrismaMultiTenantRepositoryBase<RegionEntity, RegionModel>
  implements RegionRepositoryPort
{
  protected modelName = 'region';

  constructor(private prisma: PrismaClientManager, mapper: RegionMapper) {
    super(prisma, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<RegionEntity>> {
    // Get client by context

    const result = await this.prisma[this.modelName].findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'region_code',
      value: result.regionCode,
      excludeTables: ['bs_region'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
