import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import { CleanMethodEntity } from '@modules/clean-method/domain/clean-method.entity';
import { CleanMethodNotFoundError } from '@modules/clean-method/domain/clean-method.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindCleanMethodQuery {
  cleanMethodId: bigint;

  constructor(public readonly id: bigint) {
    this.cleanMethodId = id;
  }
}

export type FindCleanMethodQueryResult = Result<
  CleanMethodEntity,
  CleanMethodNotFoundError
>;

@QueryHandler(FindCleanMethodQuery)
export class FindCleanMethodQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CLEAN_METHOD_REPOSITORY)
    protected readonly cleanMethodRepo: CleanMethodRepositoryPort,
  ) {}

  async execute(
    query: FindCleanMethodQuery,
  ): Promise<FindCleanMethodQueryResult> {
    const found = await this.cleanMethodRepo.findOneById(query.cleanMethodId);
    if (found.isNone()) return Err(new CleanMethodNotFoundError());

    return Ok(found.unwrap());
  }
}
