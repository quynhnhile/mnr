import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { ComDamRep as ComDamRepModel, Prisma } from '@prisma/client';
import { ComDamRepEntity } from '../domain/com-dam-rep.entity';
import { ComDamRepMapper } from '../mappers/com-dam-rep.mapper';
import { ComDamRepRepositoryPort } from './com-dam-rep.repository.port';

export const ComDamRepScalarFieldEnum = Prisma.ComDamRepScalarFieldEnum;

@Injectable()
export class PrismaComDamRepRepository
  extends PrismaMultiTenantRepositoryBase<ComDamRepEntity, ComDamRepModel>
  implements ComDamRepRepositoryPort
{
  protected modelName = 'comDamRep';

  constructor(private manager: PrismaClientManager, mapper: ComDamRepMapper) {
    super(manager, mapper);
  }
}
