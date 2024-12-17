import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Container as ContainerModel, Prisma } from '@prisma/client';
import { ContainerEntity } from '../domain/container.entity';
import { ContainerMapper } from '../mappers/container.mapper';
import { ContainerRepositoryPort } from './container.repository.port';

export const ContainerScalarFieldEnum = Prisma.ContainerScalarFieldEnum;

@Injectable()
export class PrismaContainerRepository
  extends PrismaMultiTenantRepositoryBase<ContainerEntity, ContainerModel>
  implements ContainerRepositoryPort
{
  protected modelName = 'container';

  constructor(private manager: PrismaClientManager, mapper: ContainerMapper) {
    super(manager, mapper);
  }

  async findOneByIdOrContNo(
    idOrContNo: string,
  ): Promise<Option<ContainerEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.container.findFirst({
      where: { OR: [{ idCont: idOrContNo }, { containerNo: idOrContNo }] },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
