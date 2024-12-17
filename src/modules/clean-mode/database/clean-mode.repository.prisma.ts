import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { CleanMode as CleanModeModel, Prisma } from '@prisma/client';
import { CleanModeEntity } from '../domain/clean-mode.entity';
import { CleanModeMapper } from '../mappers/clean-mode.mapper';
import { CleanModeRepositoryPort } from './clean-mode.repository.port';

export const CleanModeScalarFieldEnum = Prisma.CleanModeScalarFieldEnum;

@Injectable()
export class PrismaCleanModeRepository
  extends PrismaMultiTenantRepositoryBase<CleanModeEntity, CleanModeModel>
  implements CleanModeRepositoryPort
{
  protected modelName = 'cleanMode';

  constructor(private manager: PrismaClientManager, mapper: CleanModeMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<CleanModeEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.cleanMode.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'clean_mode_code',
      value: result.cleanModeCode,
      excludeTables: ['bs_clean_mode'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(
    code: string,
    operationCode?: string,
  ): Promise<Option<CleanModeEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.cleanMode.findFirst({
      where: { cleanModeCode: code, operationCode },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
