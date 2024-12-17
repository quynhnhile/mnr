import { Err, Ok, Result } from 'oxide.ts';
import { SYMBOL_REPOSITORY } from '@modules/symbol/symbol.di-tokens';
import { SymbolRepositoryPort } from '@modules/symbol/database/symbol.repository.port';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import { SymbolNotFoundError } from '@modules/symbol/domain/symbol.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindSymbolQuery {
  symbolId: bigint;

  constructor(public readonly id: bigint) {
    this.symbolId = id;
  }
}

export type FindSymbolQueryResult = Result<SymbolEntity, SymbolNotFoundError>;

@QueryHandler(FindSymbolQuery)
export class FindSymbolQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SYMBOL_REPOSITORY)
    protected readonly symbolRepo: SymbolRepositoryPort,
  ) {}

  async execute(query: FindSymbolQuery): Promise<FindSymbolQueryResult> {
    const found = await this.symbolRepo.findOneById(query.symbolId);
    if (found.isNone()) return Err(new SymbolNotFoundError());

    return Ok(found.unwrap());
  }
}
