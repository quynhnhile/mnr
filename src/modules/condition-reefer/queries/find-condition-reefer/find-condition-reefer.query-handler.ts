import { Err, Ok, Result } from 'oxide.ts';
import { CONDITION_REEFER_REPOSITORY } from '@modules/condition-reefer/condition-reefer.di-tokens';
import { ConditionReeferRepositoryPort } from '@modules/condition-reefer/database/condition-reefer.repository.port';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import { ConditionReeferNotFoundError } from '@modules/condition-reefer/domain/condition-reefer.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindConditionReeferQuery {
  conditionReeferId: bigint;

  constructor(public readonly id: bigint) {
    this.conditionReeferId = id;
  }
}

export type FindConditionReeferQueryResult = Result<
  ConditionReeferEntity,
  ConditionReeferNotFoundError
>;

@QueryHandler(FindConditionReeferQuery)
export class FindConditionReeferQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONDITION_REEFER_REPOSITORY)
    protected readonly conditionReeferRepo: ConditionReeferRepositoryPort,
  ) {}

  async execute(
    query: FindConditionReeferQuery,
  ): Promise<FindConditionReeferQueryResult> {
    const found = await this.conditionReeferRepo.findOneById(
      query.conditionReeferId,
    );
    if (found.isNone()) return Err(new ConditionReeferNotFoundError());

    return Ok(found.unwrap());
  }
}
