import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import {
  GroupLocationLocal as GroupLocationLocalModel,
  Prisma,
} from '@prisma/client';
import { GroupLocationLocalEntity } from '../domain/group-location-local.entity';
import { GroupLocationLocalMapper } from '../mappers/group-location-local.mapper';
import { GroupLocationLocalRepositoryPort } from './group-location-local.repository.port';

export const GroupLocationLocalScalarFieldEnum =
  Prisma.GroupLocationLocalScalarFieldEnum;

@Injectable()
export class PrismaGroupLocationLocalRepository
  extends PrismaMultiTenantRepositoryBase<
    GroupLocationLocalEntity,
    GroupLocationLocalModel
  >
  implements GroupLocationLocalRepositoryPort
{
  protected modelName = 'groupLocationLocal';

  constructor(
    private manager: PrismaClientManager,
    mapper: GroupLocationLocalMapper,
  ) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<GroupLocationLocalEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.groupLocationLocal.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'group_loc_local_code',
      value: result.groupLocLocalCode,
      excludeTables: ['bs_group_location_local'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
