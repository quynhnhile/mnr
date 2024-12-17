import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import { CleanMethodEntity } from '@modules/clean-method/domain/clean-method.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';

export class FindCleanMethodsQuery extends PrismaPaginatedQueryBase<Prisma.CleanMethodWhereInput> {}

export type FindCleanMethodsQueryResult = Result<
  Paginated<CleanMethodEntity>,
  void
>;

@QueryHandler(FindCleanMethodsQuery)
export class FindCleanMethodsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CLEAN_METHOD_REPOSITORY)
    protected readonly cleanMethodRepo: CleanMethodRepositoryPort,
  ) {}

  async execute(
    query: FindCleanMethodsQuery,
  ): Promise<FindCleanMethodsQueryResult> {
    const result = await this.cleanMethodRepo.findAllPaginated(query);

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
