import { Err, Ok, Result } from 'oxide.ts';
import { DAMAGE_REPOSITORY } from '@modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@modules/damage/database/damage.repository.port';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import { DamageNotFoundError } from '@modules/damage/domain/damage.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindDamageQuery {
  damageId: bigint;

  constructor(public readonly id: bigint) {
    this.damageId = id;
  }
}

export type FindDamageQueryResult = Result<DamageEntity, DamageNotFoundError>;

@QueryHandler(FindDamageQuery)
export class FindDamageQueryHandler implements IQueryHandler {
  constructor(
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort
  ) {}

  async execute(query: FindDamageQuery): Promise<FindDamageQueryResult> {
    const found = await this.damageRepo.findOneById(query.damageId);
    if (found.isNone()) return Err(new DamageNotFoundError());

    return Ok(found.unwrap());
  }
}
