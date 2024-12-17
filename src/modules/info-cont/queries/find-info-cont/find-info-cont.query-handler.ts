import { Err, Ok, Result } from 'oxide.ts';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindInfoContQuery {
  infoContId: bigint;

  constructor(public readonly id: bigint) {
    this.infoContId = id;
  }
}

export type FindInfoContQueryResult = Result<
  InfoContEntity,
  InfoContNotFoundError
>;

@QueryHandler(FindInfoContQuery)
export class FindInfoContQueryHandler implements IQueryHandler {
  constructor(
    @Inject(INFO_CONT_REPOSITORY)
    protected readonly infoContRepo: InfoContRepositoryPort,
  ) {}

  async execute(query: FindInfoContQuery): Promise<FindInfoContQueryResult> {
    const found = await this.infoContRepo.findOneById(query.infoContId);
    if (found.isNone()) return Err(new InfoContNotFoundError());

    return Ok(found.unwrap());
  }
}
