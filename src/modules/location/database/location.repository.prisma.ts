import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Location as LocationModel, Prisma } from '@prisma/client';
import { LocationEntity } from '../domain/location.entity';
import { LocationMapper } from '../mappers/location.mapper';
import { LocationRepositoryPort } from './location.repository.port';

export const LocationScalarFieldEnum = Prisma.LocationScalarFieldEnum;

@Injectable()
export class PrismaLocationRepository
  extends PrismaMultiTenantRepositoryBase<LocationEntity, LocationModel>
  implements LocationRepositoryPort
{
  protected modelName = 'location';

  constructor(private manager: PrismaClientManager, mapper: LocationMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<LocationEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.location.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'loc_code',
      value: result.locCode,
      excludeTables: ['bs_location'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(code: string): Promise<Option<LocationEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.location.findFirst({
      where: { locCode: code },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findManyBycodes(codes: string[]): Promise<LocationEntity[]> {
    // Get client by context
    const client = await this._getClient();

    const results = await client.location.findMany({
      where: { locCode: { in: codes } },
    });

    return results.map((result) => this.mapper.toDomain(result));
  }
}
