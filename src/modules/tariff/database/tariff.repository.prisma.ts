import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, Tariff as TariffModel } from '@prisma/client';
import { TariffEntity } from '../domain/tariff.entity';
import { TariffMapper } from '../mappers/tariff.mapper';
import { TariffRepositoryPort } from './tariff.repository.port';

export const TariffScalarFieldEnum = Prisma.TariffScalarFieldEnum;

@Injectable()
export class PrismaTariffRepository
  extends PrismaMultiTenantRepositoryBase<TariffEntity, TariffModel>
  implements TariffRepositoryPort
{
  protected modelName = 'tariff';

  constructor(private manager: PrismaClientManager, mapper: TariffMapper) {
    super(manager, mapper);
  }
}
