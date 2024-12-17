import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { SYS_CONFIG_OPR_REPOSITORY } from '@modules/sys-config-opr/sys-config-opr.di-tokens';
import { SysConfigOprRepositoryPort } from '@modules/sys-config-opr/database/sys-config-opr.repository.port';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindSysConfigOprsQuery extends PrismaPaginatedQueryBase<Prisma.SysConfigOprWhereInput> {}

export type FindSysConfigOprsQueryResult = Result<
  Paginated<SysConfigOprEntity>,
  void
>;

@QueryHandler(FindSysConfigOprsQuery)
export class FindSysConfigOprsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SYS_CONFIG_OPR_REPOSITORY)
    protected readonly sysConfigOprRepo: SysConfigOprRepositoryPort,
  ) {}

  async execute(
    query: FindSysConfigOprsQuery,
  ): Promise<FindSysConfigOprsQueryResult> {
    const result = await this.sysConfigOprRepo.findAllPaginated(query);

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
