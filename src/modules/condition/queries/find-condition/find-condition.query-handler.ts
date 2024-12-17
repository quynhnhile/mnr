import { Err, Ok, Result } from 'oxide.ts';
import { CONDITION_REPOSITORY } from '@modules/condition/condition.di-tokens';
import { ConditionRepositoryPort } from '@modules/condition/database/condition.repository.port';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import { ConditionNotFoundError } from '@modules/condition/domain/condition.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindConditionQuery {
  conditionId: bigint;

  constructor(public readonly id: bigint) {
    this.conditionId = id;
  }
}

export type FindConditionQueryResult = Result<ConditionEntity, ConditionNotFoundError>;

@QueryHandler(FindConditionQuery)
export class FindConditionQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONDITION_REPOSITORY)
    protected readonly conditionRepo: ConditionRepositoryPort
  ) {}

  async execute(query: FindConditionQuery): Promise<FindConditionQueryResult> {
    const found = await this.conditionRepo.findOneById(query.conditionId);
    if (found.isNone()) return Err(new ConditionNotFoundError());

    return Ok(found.unwrap());
  }
}
