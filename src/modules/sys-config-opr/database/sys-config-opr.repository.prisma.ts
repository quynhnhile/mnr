import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, SysConfigOpr as SysConfigOprModel } from '@prisma/client';
import { SysConfigOprEntity } from '../domain/sys-config-opr.entity';
import { SysConfigOprMapper } from '../mappers/sys-config-opr.mapper';
import { SysConfigOprRepositoryPort } from './sys-config-opr.repository.port';

export const SysConfigOprScalarFieldEnum = Prisma.SysConfigOprScalarFieldEnum;

@Injectable()
export class PrismaSysConfigOprRepository
  extends PrismaMultiTenantRepositoryBase<SysConfigOprEntity, SysConfigOprModel>
  implements SysConfigOprRepositoryPort
{
  protected modelName = 'sysConfigOpr';

  constructor(
    private manager: PrismaClientManager,
    mapper: SysConfigOprMapper,
  ) {
    super(manager, mapper);
  }
}
