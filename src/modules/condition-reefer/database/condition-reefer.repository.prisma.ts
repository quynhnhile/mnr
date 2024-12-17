import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import {
  ConditionReefer as ConditionReeferModel,
  Prisma,
} from '@prisma/client';
import { ConditionReeferEntity } from '../domain/condition-reefer.entity';
import { ConditionReeferMapper } from '../mappers/condition-reefer.mapper';
import { ConditionReeferRepositoryPort } from './condition-reefer.repository.port';

export const ConditionReeferScalarFieldEnum =
  Prisma.ConditionReeferScalarFieldEnum;

@Injectable()
export class PrismaConditionReeferRepository
  extends PrismaMultiTenantRepositoryBase<
    ConditionReeferEntity,
    ConditionReeferModel
  >
  implements ConditionReeferRepositoryPort
{
  protected modelName = 'conditionReefer';

  constructor(
    private manager: PrismaClientManager,
    mapper: ConditionReeferMapper,
  ) {
    super(manager, mapper);
  }
}
