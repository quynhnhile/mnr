import { Err, Ok, Result } from 'oxide.ts';
import { DAMAGE_LOCAL_REPOSITORY } from '@modules/damage-local/damage-local.di-tokens';
import { DamageLocalRepositoryPort } from '@modules/damage-local/database/damage-local.repository.port';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import { DamageLocalNotFoundError } from '@modules/damage-local/domain/damage-local.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindDamageLocalQuery {
  damageLocalId: bigint;

  constructor(public readonly id: bigint) {
    this.damageLocalId = id;
  }
}

export type FindDamageLocalQueryResult = Result<DamageLocalEntity, DamageLocalNotFoundError>;

@QueryHandler(FindDamageLocalQuery)
export class FindDamageLocalQueryHandler implements IQueryHandler {
  constructor(
    @Inject(DAMAGE_LOCAL_REPOSITORY)
    protected readonly damageLocalRepo: DamageLocalRepositoryPort
  ) {}

  async execute(query: FindDamageLocalQuery): Promise<FindDamageLocalQueryResult> {
    const found = await this.damageLocalRepo.findOneById(query.damageLocalId);
    if (found.isNone()) return Err(new DamageLocalNotFoundError());

    return Ok(found.unwrap());
  }
}
