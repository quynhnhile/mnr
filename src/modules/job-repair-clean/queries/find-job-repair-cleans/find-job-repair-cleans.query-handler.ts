import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@modules/job-repair-clean/database/job-repair-clean.repository.port';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindJobRepairCleansQuery extends PrismaPaginatedQueryBase<Prisma.JobRepairCleanWhereInput> {}

export type FindJobRepairCleansQueryResult = Result<
  Paginated<JobRepairCleanEntity>,
  void
>;

@QueryHandler(FindJobRepairCleansQuery)
export class FindJobRepairCleansQueryHandler implements IQueryHandler {
  constructor(
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    query: FindJobRepairCleansQuery,
  ): Promise<FindJobRepairCleansQueryResult> {
    const result = await this.jobRepairCleanRepo.findAllPaginated(query);

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
