import { RepositoryPort } from '@libs/ddd';
import { JobRepairCleanEntity } from '../domain/job-repair-clean.entity';
import { Prisma } from '@prisma/client';

export interface JobRepairCleanRepositoryPort
  extends RepositoryPort<JobRepairCleanEntity> {
  //startJobRepairCleanItem(id: bigint): Promise<Option<JobRepairCleanEntity>>;
  createJobRepairClean(
    entity: JobRepairCleanEntity,
  ): Promise<JobRepairCleanEntity>;
  countCurrentIndex(): Promise<number>;
  findJobByContNoAndIdCont(
    params: Prisma.JobRepairCleanFindManyArgs,
  ): Promise<JobRepairCleanEntity[]>;
}
