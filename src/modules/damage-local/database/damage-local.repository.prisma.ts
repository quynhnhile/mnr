import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { DamageLocal as DamageLocalModel, Prisma } from '@prisma/client';
import { DamageLocalEntity } from '../domain/damage-local.entity';
import { DamageLocalMapper } from '../mappers/damage-local.mapper';
import { DamageLocalRepositoryPort } from './damage-local.repository.port';

export const DamageLocalScalarFieldEnum = Prisma.DamageLocalScalarFieldEnum;

@Injectable()
export class PrismaDamageLocalRepository
  extends PrismaMultiTenantRepositoryBase<DamageLocalEntity, DamageLocalModel>
  implements DamageLocalRepositoryPort
{
  protected modelName = 'damageLocal';

  constructor(private manager: PrismaClientManager, mapper: DamageLocalMapper) {
    super(manager, mapper);
  }
}
