import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, TariffGroup as TariffGroupModel } from '@prisma/client';
import { TariffGroupEntity } from '../domain/tariff-group.entity';
import { TariffGroupMapper } from '../mappers/tariff-group.mapper';
import { TariffGroupRepositoryPort } from './tariff-group.repository.port';

export const TariffGroupScalarFieldEnum = Prisma.TariffGroupScalarFieldEnum;

@Injectable()
export class PrismaTariffGroupRepository
  extends PrismaMultiTenantRepositoryBase<TariffGroupEntity, TariffGroupModel>
  implements TariffGroupRepositoryPort
{
  protected modelName = 'tariffGroup';

  constructor(private manager: PrismaClientManager, mapper: TariffGroupMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<TariffGroupEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.tariffGroup.findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'group_trf_code',
      value: result.groupTrfCode,
      excludeTables: ['bs_tariff_group'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }

  async findOneByCode(code: string): Promise<Option<TariffGroupEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.tariffGroup.findFirst({
      where: { groupTrfCode: code },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findManyBycodes(codes: string[]): Promise<TariffGroupEntity[]> {
    const client = await this._getClient();

    // Tạo mảng điều kiện cho từng `code` để tìm kiếm bằng `contains`
    const conditions = codes.map((code) => ({
      operationCode: { contains: code },
    }));

    // Tìm các bản ghi mà có bất kỳ `operationCode` nào chứa một trong các `codes`
    const results = await client.tariffGroup.findMany({
      where: {
        OR: conditions,
      },
    });

    return results.map((result) => this.mapper.toDomain(result));
  }
}
