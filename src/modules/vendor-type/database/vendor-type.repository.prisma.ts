import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, VendorType as VendorTypeModel } from '@prisma/client';
import { VendorTypeEntity } from '../domain/vendor-type.entity';
import { VendorTypeMapper } from '../mappers/vendor-type.mapper';
import { VendorTypeRepositoryPort } from './vendor-type.repository.port';

export const VendorTypeScalarFieldEnum = Prisma.VendorTypeScalarFieldEnum;

@Injectable()
export class PrismaVendorTypeRepository
  extends PrismaMultiTenantRepositoryBase<VendorTypeEntity, VendorTypeModel>
  implements VendorTypeRepositoryPort
{
  protected modelName = 'vendorType';

  constructor(private manager: PrismaClientManager, mapper: VendorTypeMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<VendorTypeEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client[this.modelName].findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'vendor_type_code',
      value: result.VendorTypeCode,
      excludeTables: ['bs_vendor_type'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
