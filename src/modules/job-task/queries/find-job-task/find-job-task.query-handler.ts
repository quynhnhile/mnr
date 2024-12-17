import { Err, Ok, Result } from 'oxide.ts';
import { JOB_TASK_REPOSITORY } from '@modules/job-task/job-task.di-tokens';
import { JobTaskRepositoryPort } from '@modules/job-task/database/job-task.repository.port';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import { JobTaskNotFoundError } from '@modules/job-task/domain/job-task.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindJobTaskQuery {
  jobTaskId: bigint;

  constructor(public readonly id: bigint) {
    this.jobTaskId = id;
  }
}

export type FindJobTaskQueryResult = Result<JobTaskEntity, JobTaskNotFoundError>;

@QueryHandler(FindJobTaskQuery)
export class FindJobTaskQueryHandler implements IQueryHandler {
  constructor(
    @Inject(JOB_TASK_REPOSITORY)
    protected readonly jobTaskRepo: JobTaskRepositoryPort
  ) {}

  async execute(query: FindJobTaskQuery): Promise<FindJobTaskQueryResult> {
    const found = await this.jobTaskRepo.findOneById(query.jobTaskId);
    if (found.isNone()) return Err(new JobTaskNotFoundError());

    return Ok(found.unwrap());
  }
}
