import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusType as StatusTypeModel } from '@prisma/client';
import { StatusTypeEntity } from '../domain/status-type.entity';
import { StatusTypeMapper } from '../mappers/status-type.mapper';
import { StatusTypeRepositoryPort } from './status-type.repository.port';
import { None, Option, Some } from 'oxide.ts';

export const StatusTypeScalarFieldEnum = Prisma.StatusTypeScalarFieldEnum;

@Injectable()
export class PrismaStatusTypeRepository
  extends PrismaMultiTenantRepositoryBase<StatusTypeEntity, StatusTypeModel>
  implements StatusTypeRepositoryPort
{
  protected modelName = 'statusType';

  constructor(private manager: PrismaClientManager, mapper: StatusTypeMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<StatusTypeEntity>> {
    const client = await this._getClient();

    const result = await client.statusType.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'status_type_code',
      value: result.statusTypeCode,
      excludeTables: ['bs_status_type'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
