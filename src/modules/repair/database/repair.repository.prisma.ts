import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, Repair as RepairModel } from '@prisma/client';
import { RepairEntity } from '../domain/repair.entity';
import { RepairMapper } from '../mappers/repair.mapper';
import { RepairRepositoryPort } from './repair.repository.port';

export const RepairScalarFieldEnum = Prisma.RepairScalarFieldEnum;

@Injectable()
export class PrismaRepairRepository
  extends PrismaMultiTenantRepositoryBase<RepairEntity, RepairModel>
  implements RepairRepositoryPort
{
  protected modelName = 'repair';

  constructor(private manager: PrismaClientManager, mapper: RepairMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<RepairEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.repair.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'rep_code',
      value: result.repCode,
      excludeTables: ['bs_repair'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(
    code: string,
    operationCodes?: string[],
  ): Promise<Option<RepairEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.repair.findFirst({
      where: {
        repCode: code,
        operationCode: operationCodes?.length
          ? { in: operationCodes }
          : undefined,
      },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
