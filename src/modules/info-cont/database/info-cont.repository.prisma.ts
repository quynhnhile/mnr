import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { InfoCont as InfoContModel, Prisma } from '@prisma/client';
import { InfoContEntity } from '../domain/info-cont.entity';
import { InfoContMapper } from '../mappers/info-cont.mapper';
import { InfoContRepositoryPort } from './info-cont.repository.port';

export const InfoContScalarFieldEnum = Prisma.InfoContScalarFieldEnum;

@Injectable()
export class PrismaInfoContRepository
  extends PrismaMultiTenantRepositoryBase<InfoContEntity, InfoContModel>
  implements InfoContRepositoryPort
{
  protected modelName = 'infoCont';

  constructor(private manager: PrismaClientManager, mapper: InfoContMapper) {
    super(manager, mapper);
  }

  async findOneByContNo(containerNo: string): Promise<Option<InfoContEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.infoCont.findFirst({
      where: { containerNo },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
