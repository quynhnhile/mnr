import { Err, Ok, Result } from 'oxide.ts';
import { CONT_SIZE_MAP_REPOSITORY } from '@modules/cont-size-map/cont-size-map.di-tokens';
import { ContSizeMapRepositoryPort } from '@modules/cont-size-map/database/cont-size-map.repository.port';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import { ContSizeMapNotFoundError } from '@modules/cont-size-map/domain/cont-size-map.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindContSizeMapQuery {
  contSizeMapId: bigint;

  constructor(public readonly id: bigint) {
    this.contSizeMapId = id;
  }
}

export type FindContSizeMapQueryResult = Result<
  ContSizeMapEntity,
  ContSizeMapNotFoundError
>;

@QueryHandler(FindContSizeMapQuery)
export class FindContSizeMapQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONT_SIZE_MAP_REPOSITORY)
    protected readonly contSizeMapRepo: ContSizeMapRepositoryPort,
  ) {}

  async execute(
    query: FindContSizeMapQuery,
  ): Promise<FindContSizeMapQueryResult> {
    const found = await this.contSizeMapRepo.findOneById(query.contSizeMapId);
    if (found.isNone()) return Err(new ContSizeMapNotFoundError());

    return Ok(found.unwrap());
  }
}
