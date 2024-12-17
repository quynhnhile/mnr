import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Component as ComponentModel, Prisma } from '@prisma/client';
import { ComponentEntity } from '../domain/component.entity';
import { ComponentMapper } from '../mappers/component.mapper';
import { ComponentRepositoryPort } from './component.repository.port';

export const ComponentScalarFieldEnum = Prisma.ComponentScalarFieldEnum;

@Injectable()
export class PrismaComponentRepository
  extends PrismaMultiTenantRepositoryBase<ComponentEntity, ComponentModel>
  implements ComponentRepositoryPort
{
  protected modelName = 'component';

  constructor(private manager: PrismaClientManager, mapper: ComponentMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<ComponentEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.component.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'comp_code',
      value: result.compCode,
      excludeTables: ['bs_component'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(
    code: string,
    operationCodes?: string[],
  ): Promise<Option<ComponentEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.component.findFirst({
      where: {
        compCode: code,
        operationCode: operationCodes?.length
          ? { in: operationCodes }
          : undefined,
      },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
