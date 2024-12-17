import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import { CleanModeEntity } from '@modules/clean-mode/domain/clean-mode.entity';
import { CleanModeNotFoundError } from '@modules/clean-mode/domain/clean-mode.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindCleanModeQuery {
  cleanModeId: bigint;

  constructor(public readonly id: bigint) {
    this.cleanModeId = id;
  }
}

export type FindCleanModeQueryResult = Result<CleanModeEntity, CleanModeNotFoundError>;

@QueryHandler(FindCleanModeQuery)
export class FindCleanModeQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CLEAN_MODE_REPOSITORY)
    protected readonly cleanModeRepo: CleanModeRepositoryPort
  ) {}

  async execute(query: FindCleanModeQuery): Promise<FindCleanModeQueryResult> {
    const found = await this.cleanModeRepo.findOneById(query.cleanModeId);
    if (found.isNone()) return Err(new CleanModeNotFoundError());

    return Ok(found.unwrap());
  }
}
