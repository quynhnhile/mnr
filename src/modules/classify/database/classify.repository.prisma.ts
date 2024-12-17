import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Classify as ClassifyModel, Prisma } from '@prisma/client';
import { ClassifyEntity } from '../domain/classify.entity';
import { ClassifyMapper } from '../mappers/classify.mapper';
import { ClassifyRepositoryPort } from './classify.repository.port';

export const ClassifyScalarFieldEnum = Prisma.ClassifyScalarFieldEnum;

@Injectable()
export class PrismaClassifyRepository
  extends PrismaMultiTenantRepositoryBase<ClassifyEntity, ClassifyModel>
  implements ClassifyRepositoryPort
{
  protected modelName = 'classify';

  constructor(private manager: PrismaClientManager, mapper: ClassifyMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<ClassifyEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.classify.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'classify_code',
      value: result.classifyCode,
      excludeTables: ['bs_classify'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(
    code: string,
    operationCode?: string,
  ): Promise<Option<ClassifyEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.classify.findFirst({
      where: { classifyCode: code, operationCode },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
