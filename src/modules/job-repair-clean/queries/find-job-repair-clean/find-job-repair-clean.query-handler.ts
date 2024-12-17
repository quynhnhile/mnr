import { Err, Ok, Result } from 'oxide.ts';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@modules/job-repair-clean/database/job-repair-clean.repository.port';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { JobRepairCleanNotFoundError } from '@modules/job-repair-clean/domain/job-repair-clean.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindJobRepairCleanQuery {
  jobRepairCleanId: bigint;

  constructor(public readonly id: bigint) {
    this.jobRepairCleanId = id;
  }
}

export type FindJobRepairCleanQueryResult = Result<JobRepairCleanEntity, JobRepairCleanNotFoundError>;

@QueryHandler(FindJobRepairCleanQuery)
export class FindJobRepairCleanQueryHandler implements IQueryHandler {
  constructor(
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort
  ) {}

  async execute(query: FindJobRepairCleanQuery): Promise<FindJobRepairCleanQueryResult> {
    const found = await this.jobRepairCleanRepo.findOneById(query.jobRepairCleanId);
    if (found.isNone()) return Err(new JobRepairCleanNotFoundError());

    return Ok(found.unwrap());
  }
}
