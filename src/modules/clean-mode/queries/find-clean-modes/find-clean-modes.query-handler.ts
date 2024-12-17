import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import { CleanModeEntity } from '@modules/clean-mode/domain/clean-mode.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindCleanModesQuery extends PrismaPaginatedQueryBase<Prisma.CleanModeWhereInput> {}

export type FindCleanModesQueryResult = Result<
  Paginated<CleanModeEntity>,
  void
>;

@QueryHandler(FindCleanModesQuery)
export class FindCleanModesQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CLEAN_MODE_REPOSITORY)
    protected readonly cleanModeRepo: CleanModeRepositoryPort,
  ) {}

  async execute(
    query: FindCleanModesQuery,
  ): Promise<FindCleanModesQueryResult> {
    const result = await this.cleanModeRepo.findAllPaginated(query);

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
