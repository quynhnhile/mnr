import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, Symbol as SymbolModel } from '@prisma/client';
import { SymbolEntity } from '../domain/symbol.entity';
import { SymbolMapper } from '../mappers/symbol.mapper';
import { SymbolRepositoryPort } from './symbol.repository.port';
import { None, Option, Some } from 'oxide.ts';

export const SymbolScalarFieldEnum = Prisma.SymbolScalarFieldEnum;

@Injectable()
export class PrismaSymbolRepository
  extends PrismaMultiTenantRepositoryBase<SymbolEntity, SymbolModel>
  implements SymbolRepositoryPort
{
  protected modelName = 'symbol';

  constructor(private manager: PrismaClientManager, mapper: SymbolMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<SymbolEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.symbol.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'symbol_code',
      value: result.symbolCode,
      excludeTables: ['bs_symbol'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
