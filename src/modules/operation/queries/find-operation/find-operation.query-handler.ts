import { Err, Ok, Result } from 'oxide.ts';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationEntity } from '@modules/operation/domain/operation.entity';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindOperationQuery {
  operationId: bigint;

  constructor(public readonly id: bigint) {
    this.operationId = id;
  }
}

export type FindOperationQueryResult = Result<
  OperationEntity,
  OperationNotFoundError
>;

@QueryHandler(FindOperationQuery)
export class FindOperationQueryHandler implements IQueryHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    protected readonly operationRepo: OperationRepositoryPort,
  ) {}

  async execute(query: FindOperationQuery): Promise<FindOperationQueryResult> {
    const found = await this.operationRepo.findOneById(query.operationId);
    if (found.isNone()) return Err(new OperationNotFoundError());

    return Ok(found.unwrap());
  }
}
