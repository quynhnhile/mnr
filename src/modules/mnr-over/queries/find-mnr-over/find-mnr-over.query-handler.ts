import { Err, Ok, Result } from 'oxide.ts';
import { MNR_OVER_REPOSITORY } from '@modules/mnr-over/mnr-over.di-tokens';
import { MnrOverRepositoryPort } from '@modules/mnr-over/database/mnr-over.repository.port';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import { MnrOverNotFoundError } from '@modules/mnr-over/domain/mnr-over.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindMnrOverQuery {
  mnrOverId: bigint;

  constructor(public readonly id: bigint) {
    this.mnrOverId = id;
  }
}

export type FindMnrOverQueryResult = Result<
  MnrOverEntity,
  MnrOverNotFoundError
>;

@QueryHandler(FindMnrOverQuery)
export class FindMnrOverQueryHandler implements IQueryHandler {
  constructor(
    @Inject(MNR_OVER_REPOSITORY)
    protected readonly mnrOverRepo: MnrOverRepositoryPort,
  ) {}

  async execute(query: FindMnrOverQuery): Promise<FindMnrOverQueryResult> {
    const found = await this.mnrOverRepo.findOneById(query.mnrOverId);
    if (found.isNone()) return Err(new MnrOverNotFoundError());

    return Ok(found.unwrap());
  }
}
