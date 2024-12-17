import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Damage as DamageModel, Prisma } from '@prisma/client';
import { DamageEntity } from '../domain/damage.entity';
import { DamageMapper } from '../mappers/damage.mapper';
import { DamageRepositoryPort } from './damage.repository.port';

export const DamageScalarFieldEnum = Prisma.DamageScalarFieldEnum;

@Injectable()
export class PrismaDamageRepository
  extends PrismaMultiTenantRepositoryBase<DamageEntity, DamageModel>
  implements DamageRepositoryPort
{
  protected modelName = 'damage';

  constructor(private manager: PrismaClientManager, mapper: DamageMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<DamageEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.damage.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'dam_code',
      value: result.damCode,
      excludeTables: ['bs_damage'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(
    code: string,
    operationCodes?: string[],
  ): Promise<Option<DamageEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.damage.findFirst({
      where: {
        damCode: code,
        operationCode: operationCodes?.length
          ? { in: operationCodes }
          : undefined,
      },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
