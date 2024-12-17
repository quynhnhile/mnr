import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { ContSizeMap as ContSizeMapModel, Prisma } from '@prisma/client';
import { ContSizeMapEntity } from '../domain/cont-size-map.entity';
import { ContSizeMapMapper } from '../mappers/cont-size-map.mapper';
import { ContSizeMapRepositoryPort } from './cont-size-map.repository.port';

export const ContSizeMapScalarFieldEnum = Prisma.ContSizeMapScalarFieldEnum;

@Injectable()
export class PrismaContSizeMapRepository
  extends PrismaMultiTenantRepositoryBase<ContSizeMapEntity, ContSizeMapModel>
  implements ContSizeMapRepositoryPort
{
  protected modelName = 'contSizeMap';

  constructor(private manager: PrismaClientManager, mapper: ContSizeMapMapper) {
    super(manager, mapper);
  }
}
