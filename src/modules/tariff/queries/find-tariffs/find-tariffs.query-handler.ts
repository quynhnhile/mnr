import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { TariffRepositoryPort } from '@modules/tariff/database/tariff.repository.port';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import { TARIFF_REPOSITORY } from '@modules/tariff/tariff.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindTariffsQuery extends PrismaPaginatedQueryBase<Prisma.TariffWhereInput> {}

export type FindTariffsQueryResult = Result<Paginated<TariffEntity>, void>;

@QueryHandler(FindTariffsQuery)
export class FindTariffsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TARIFF_REPOSITORY)
    protected readonly tariffRepo: TariffRepositoryPort,
  ) {}

  async execute(query: FindTariffsQuery): Promise<FindTariffsQueryResult> {
    const result = await this.tariffRepo.findAllPaginated(query);

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
