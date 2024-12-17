import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { SYMBOL_REPOSITORY } from '@modules/symbol/symbol.di-tokens';
import { SymbolRepositoryPort } from '@modules/symbol/database/symbol.repository.port';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindSymbolsQuery extends PrismaPaginatedQueryBase<Prisma.SymbolWhereInput> {}

export type FindSymbolsQueryResult = Result<Paginated<SymbolEntity>, void>;

@QueryHandler(FindSymbolsQuery)
export class FindSymbolsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SYMBOL_REPOSITORY)
    protected readonly symbolRepo: SymbolRepositoryPort,
  ) {}

  async execute(query: FindSymbolsQuery): Promise<FindSymbolsQueryResult> {
    const result = await this.symbolRepo.findAllPaginated(query);

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
