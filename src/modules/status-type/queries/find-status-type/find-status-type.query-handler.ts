import { Err, Ok, Result } from 'oxide.ts';
import { STATUS_TYPE_REPOSITORY } from '@modules/status-type/status-type.di-tokens';
import { StatusTypeRepositoryPort } from '@modules/status-type/database/status-type.repository.port';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import { StatusTypeNotFoundError } from '@modules/status-type/domain/status-type.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindStatusTypeQuery {
  statusTypeId: bigint;

  constructor(public readonly id: bigint) {
    this.statusTypeId = id;
  }
}

export type FindStatusTypeQueryResult = Result<
  StatusTypeEntity,
  StatusTypeNotFoundError
>;

@QueryHandler(FindStatusTypeQuery)
export class FindStatusTypeQueryHandler implements IQueryHandler {
  constructor(
    @Inject(STATUS_TYPE_REPOSITORY)
    protected readonly statusTypeRepo: StatusTypeRepositoryPort,
  ) {}

  async execute(
    query: FindStatusTypeQuery,
  ): Promise<FindStatusTypeQueryResult> {
    const found = await this.statusTypeRepo.findOneById(query.statusTypeId);
    if (found.isNone()) return Err(new StatusTypeNotFoundError());

    return Ok(found.unwrap());
  }
}
