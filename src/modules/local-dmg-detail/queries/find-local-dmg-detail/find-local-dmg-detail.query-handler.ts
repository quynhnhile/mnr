import { Err, Ok, Result } from 'oxide.ts';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LocalDmgDetailNotFoundError } from '@modules/local-dmg-detail/domain/local-dmg-detail.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindLocalDmgDetailQuery {
  localDmgDetailId: bigint;

  constructor(public readonly id: bigint) {
    this.localDmgDetailId = id;
  }
}

export type FindLocalDmgDetailQueryResult = Result<
  LocalDmgDetailEntity,
  LocalDmgDetailNotFoundError
>;

@QueryHandler(FindLocalDmgDetailQuery)
export class FindLocalDmgDetailQueryHandler implements IQueryHandler {
  constructor(
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    protected readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
  ) {}

  async execute(
    query: FindLocalDmgDetailQuery,
  ): Promise<FindLocalDmgDetailQueryResult> {
    const found = await this.localDmgDetailRepo.findOneById(
      query.localDmgDetailId,
    );
    if (found.isNone()) return Err(new LocalDmgDetailNotFoundError());

    return Ok(found.unwrap());
  }
}
