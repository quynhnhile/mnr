import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, Vendor as VendorModel } from '@prisma/client';
import { VendorEntity } from '../domain/vendor.entity';
import { VendorMapper } from '../mappers/vendor.mapper';
import { VendorRepositoryPort } from './vendor.repository.port';

export const VendorScalarFieldEnum = Prisma.VendorScalarFieldEnum;

@Injectable()
export class PrismaVendorRepository
  extends PrismaMultiTenantRepositoryBase<VendorEntity, VendorModel>
  implements VendorRepositoryPort
{
  protected modelName = 'vendor';

  constructor(private manager: PrismaClientManager, mapper: VendorMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<VendorEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.vendor.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'vendor_code',
      value: result.vendorCode,
      excludeTables: ['bs_vendor'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(code: string): Promise<Option<VendorEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.vendor.findFirst({
      where: { vendorCode: code },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
