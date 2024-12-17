import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { LocalDmgDetail as LocalDmgDetailModel, Prisma } from '@prisma/client';
import { LocalDmgDetailEntity } from '../domain/local-dmg-detail.entity';
import { LocalDmgDetailMapper } from '../mappers/local-dmg-detail.mapper';
import { LocalDmgDetailRepositoryPort } from './local-dmg-detail.repository.port';

export const LocalDmgDetailScalarFieldEnum =
  Prisma.LocalDmgDetailScalarFieldEnum;

@Injectable()
export class PrismaLocalDmgDetailRepository
  extends PrismaMultiTenantRepositoryBase<
    LocalDmgDetailEntity,
    LocalDmgDetailModel
  >
  implements LocalDmgDetailRepositoryPort
{
  protected modelName = 'localDmgDetail';

  constructor(
    private manager: PrismaClientManager,
    mapper: LocalDmgDetailMapper,
  ) {
    super(manager, mapper);
  }

  async createLocalDmgDetail(
    entity: LocalDmgDetailEntity,
  ): Promise<LocalDmgDetailEntity> {
    const client = await this._getClient();

    const record = this.mapper.toPersistence(entity);
    delete (record as any).id; // remove id

    const result = await client.localDmgDetail.create({
      data: record,
    });

    return this.mapper.toDomain(result);
  }
}
