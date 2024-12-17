import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindTariffGroupsQuery extends PrismaPaginatedQueryBase<Prisma.TariffGroupWhereInput> {}

export type FindTariffGroupsQueryResult = Result<
  Paginated<TariffGroupEntity>,
  void
>;

@QueryHandler(FindTariffGroupsQuery)
export class FindTariffGroupsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TARIFF_GROUP_REPOSITORY)
    protected readonly tariffGroupRepo: TariffGroupRepositoryPort,
  ) {}

  async execute(
    query: FindTariffGroupsQuery,
  ): Promise<FindTariffGroupsQueryResult> {
    const result = await this.tariffGroupRepo.findAllPaginated(query);

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
