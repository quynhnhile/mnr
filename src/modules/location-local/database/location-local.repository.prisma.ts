import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { LocationLocal as LocationLocalModel, Prisma } from '@prisma/client';
import { LocationLocalEntity } from '../domain/location-local.entity';
import { LocationLocalMapper } from '../mappers/location-local.mapper';
import { LocationLocalRepositoryPort } from './location-local.repository.port';

export const LocationLocalScalarFieldEnum = Prisma.LocationLocalScalarFieldEnum;

@Injectable()
export class PrismaLocationLocalRepository
  extends PrismaMultiTenantRepositoryBase<
    LocationLocalEntity,
    LocationLocalModel
  >
  implements LocationLocalRepositoryPort
{
  protected modelName = 'locationLocal';

  constructor(
    private manager: PrismaClientManager,
    mapper: LocationLocalMapper,
  ) {
    super(manager, mapper);
  }
}
