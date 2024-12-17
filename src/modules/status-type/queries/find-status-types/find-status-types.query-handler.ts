import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { STATUS_TYPE_REPOSITORY } from '@modules/status-type/status-type.di-tokens';
import { StatusTypeRepositoryPort } from '@modules/status-type/database/status-type.repository.port';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindStatusTypesQuery extends PrismaPaginatedQueryBase<Prisma.StatusTypeWhereInput> {}

export type FindStatusTypesQueryResult = Result<
  Paginated<StatusTypeEntity>,
  void
>;

@QueryHandler(FindStatusTypesQuery)
export class FindStatusTypesQueryHandler implements IQueryHandler {
  constructor(
    @Inject(STATUS_TYPE_REPOSITORY)
    protected readonly statusTypeRepo: StatusTypeRepositoryPort,
  ) {}

  async execute(
    query: FindStatusTypesQuery,
  ): Promise<FindStatusTypesQueryResult> {
    const result = await this.statusTypeRepo.findAllPaginated(query);

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
