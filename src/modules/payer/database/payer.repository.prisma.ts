import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Payer as PayerModel, Prisma } from '@prisma/client';
import { PayerEntity } from '../domain/payer.entity';
import { PayerMapper } from '../mappers/payer.mapper';
import { PayerRepositoryPort } from './payer.repository.port';

export const PayerScalarFieldEnum = Prisma.PayerScalarFieldEnum;

@Injectable()
export class PrismaPayerRepository
  extends PrismaMultiTenantRepositoryBase<PayerEntity, PayerModel>
  implements PayerRepositoryPort
{
  protected modelName = 'payer';

  constructor(private manager: PrismaClientManager, mapper: PayerMapper) {
    super(manager, mapper);
  }
  async findOneByIdWithInUseCount(id: bigint): Promise<Option<PayerEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.payer.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'payer_code',
      value: result.payerCode,
      excludeTables: ['bs_payer'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(code: string): Promise<Option<PayerEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.payer.findFirst({
      where: {
        payerCode: code,
      },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
