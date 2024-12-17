import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { JobRepairClean as JobRepairCleanModel, Prisma } from '@prisma/client';
import { JobRepairCleanEntity } from '../domain/job-repair-clean.entity';
import { JobRepairCleanMapper } from '../mappers/job-repair-clean.mapper';
import { JobRepairCleanRepositoryPort } from './job-repair-clean.repository.port';

export const JobRepairCleanScalarFieldEnum =
  Prisma.JobRepairCleanScalarFieldEnum;

@Injectable()
export class PrismaJobRepairCleanRepository
  extends PrismaMultiTenantRepositoryBase<
    JobRepairCleanEntity,
    JobRepairCleanModel
  >
  implements JobRepairCleanRepositoryPort
{
  protected modelName = 'jobRepairClean';

  constructor(
    private manager: PrismaClientManager,
    mapper: JobRepairCleanMapper,
  ) {
    super(manager, mapper);
  }

  async createJobRepairClean(
    entity: JobRepairCleanEntity,
  ): Promise<JobRepairCleanEntity> {
    const client = await this._getClient();

    const record = this.mapper.toPersistence(entity);
    delete (record as any).id; // remove id

    const result = await client.jobRepairClean.create({
      data: record,
    });

    return this.mapper.toDomain(result);
  }

  async countCurrentIndex(): Promise<number> {
    // Get client by context
    const client = await this._getClient();

    return client.jobRepairClean.count({});
  }

  async findJobByContNoAndIdCont(
    params: Prisma.JobRepairCleanFindManyArgs,
  ): Promise<JobRepairCleanEntity[]> {
    const client = await this._getClient();

    const result = await client.jobRepairClean.findMany(params);
    return result.map(this.mapper.toDomain);
  }
}
