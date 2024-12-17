import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Operation as OperationModel, Prisma } from '@prisma/client';
import { OperationEntity } from '../domain/operation.entity';
import { OperationMapper } from '../mappers/operation.mapper';
import { OperationRepositoryPort } from './operation.repository.port';

export const OperationScalarFieldEnum = Prisma.OperationScalarFieldEnum;

@Injectable()
export class PrismaOperationRepository
  extends PrismaMultiTenantRepositoryBase<OperationEntity, OperationModel>
  implements OperationRepositoryPort
{
  protected modelName = 'operation';

  constructor(private manager: PrismaClientManager, mapper: OperationMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<OperationEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.operation.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'operation_code',
      value: result.operationCode,
      excludeTables: ['bs_operation'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(code: string): Promise<Option<OperationEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.operation.findFirst({
      where: { operationCode: code },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findManyByCodes(codes: string[]): Promise<OperationEntity[]> {
    // Get client by context
    const client = await this._getClient();

    const results = await client.operation.findMany({
      where: { operationCode: { in: codes } },
    });

    return results.map((result) => this.mapper.toDomain(result));
  }
}
