import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { ConfigMnROver as MnrOverModel, Prisma } from '@prisma/client';
import { MnrOverEntity } from '../domain/mnr-over.entity';
import { MnrOverMapper } from '../mappers/mnr-over.mapper';
import { MnrOverRepositoryPort } from './mnr-over.repository.port';

export const MnrOverScalarFieldEnum = Prisma.ConfigMnROverScalarFieldEnum;

@Injectable()
export class PrismaMnrOverRepository
  extends PrismaMultiTenantRepositoryBase<MnrOverEntity, MnrOverModel>
  implements MnrOverRepositoryPort
{
  protected modelName = 'mnrOver';

  constructor(private manager: PrismaClientManager, mapper: MnrOverMapper) {
    super(manager, mapper);
  }
}
