import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindLocalDmgDetailsQuery extends PrismaPaginatedQueryBase<Prisma.LocalDmgDetailWhereInput> {}

export type FindLocalDmgDetailsQueryResult = Result<
  Paginated<LocalDmgDetailEntity>,
  void
>;

@QueryHandler(FindLocalDmgDetailsQuery)
export class FindLocalDmgDetailsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    protected readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
  ) {}

  async execute(
    query: FindLocalDmgDetailsQuery,
  ): Promise<FindLocalDmgDetailsQueryResult> {
    const result = await this.localDmgDetailRepo.findAllPaginated(query);

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
