import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Condition as ConditionModel, Prisma } from '@prisma/client';
import { ConditionEntity } from '../domain/condition.entity';
import { ConditionMapper } from '../mappers/condition.mapper';
import { ConditionRepositoryPort } from './condition.repository.port';

export const ConditionScalarFieldEnum = Prisma.ConditionScalarFieldEnum;

@Injectable()
export class PrismaConditionRepository
  extends PrismaMultiTenantRepositoryBase<ConditionEntity, ConditionModel>
  implements ConditionRepositoryPort
{
  protected modelName = 'condition';

  constructor(private manager: PrismaClientManager, mapper: ConditionMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<ConditionEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.condition.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'condition_code',
      value: result.conditionCode,
      excludeTables: ['bs_condition'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode({
    code,
    operationCode,
    isDamage,
    isMachine,
  }: {
    code: string;
    operationCode?: string;
    isDamage?: boolean;
    isMachine?: boolean;
  }): Promise<Option<ConditionEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.condition.findFirst({
      where: { conditionCode: code, operationCode, isDamage, isMachine },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
