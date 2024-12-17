import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { CleanMethod as CleanMethodModel, Prisma } from '@prisma/client';
import { CleanMethodEntity } from '../domain/clean-method.entity';
import { CleanMethodMapper } from '../mappers/clean-method.mapper';
import { CleanMethodRepositoryPort } from './clean-method.repository.port';

export const CleanMethodScalarFieldEnum = Prisma.CleanMethodScalarFieldEnum;

@Injectable()
export class PrismaCleanMethodRepository
  extends PrismaMultiTenantRepositoryBase<CleanMethodEntity, CleanMethodModel>
  implements CleanMethodRepositoryPort
{
  protected modelName = 'cleanMethod';

  constructor(private manager: PrismaClientManager, mapper: CleanMethodMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<CleanMethodEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.cleanMethod.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'clean_method_code',
      value: result.cleanMethodCode,
      excludeTables: ['bs_clean_method'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(
    code: string,
    operationCode?: string,
  ): Promise<Option<CleanMethodEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.cleanMethod.findFirst({
      where: { cleanMethodCode: code, operationCode },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
