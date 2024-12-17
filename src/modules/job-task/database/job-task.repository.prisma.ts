import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { JobTask as JobTaskModel, Prisma } from '@prisma/client';
import { JobTaskEntity } from '../domain/job-task.entity';
import { JobTaskMapper } from '../mappers/job-task.mapper';
import { JobTaskRepositoryPort } from './job-task.repository.port';

export const JobTaskScalarFieldEnum = Prisma.JobTaskScalarFieldEnum;

@Injectable()
export class PrismaJobTaskRepository
  extends PrismaMultiTenantRepositoryBase<JobTaskEntity, JobTaskModel>
  implements JobTaskRepositoryPort
{
  protected modelName = 'jobTask';

  constructor(private manager: PrismaClientManager, mapper: JobTaskMapper) {
    super(manager, mapper);
  }

  async findOneByIdWithInUseCount(id: bigint): Promise<Option<JobTaskEntity>> {
    const client = await this._getClient();

    const result = await client[this.modelName].findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'jobtask_code',
      value: result.jobTaskCode,
      excludeTables: ['bs_jobtask'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
