import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { JOB_TASK_REPOSITORY } from '@modules/job-task/job-task.di-tokens';
import { JobTaskRepositoryPort } from '@modules/job-task/database/job-task.repository.port';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindJobTasksQuery extends PrismaPaginatedQueryBase<Prisma.JobTaskWhereInput> {}

export type FindJobTasksQueryResult = Result<Paginated<JobTaskEntity>, void>;

@QueryHandler(FindJobTasksQuery)
export class FindJobTasksQueryHandler implements IQueryHandler {
  constructor(
    @Inject(JOB_TASK_REPOSITORY)
    protected readonly jobTaskRepo: JobTaskRepositoryPort,
  ) {}

  async execute(query: FindJobTasksQuery): Promise<FindJobTasksQueryResult> {
    const result = await this.jobTaskRepo.findAllPaginated(query);

    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
