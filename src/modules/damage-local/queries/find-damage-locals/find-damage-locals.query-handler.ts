import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { DAMAGE_LOCAL_REPOSITORY } from '@modules/damage-local/damage-local.di-tokens';
import { DamageLocalRepositoryPort } from '@modules/damage-local/database/damage-local.repository.port';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindDamageLocalsQuery extends PrismaPaginatedQueryBase<Prisma.DamageLocalWhereInput> {}

export type FindDamageLocalsQueryResult = Result<
  Paginated<DamageLocalEntity>,
  void
>;

@QueryHandler(FindDamageLocalsQuery)
export class FindDamageLocalsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(DAMAGE_LOCAL_REPOSITORY)
    protected readonly damageLocalRepo: DamageLocalRepositoryPort,
  ) {}

  async execute(
    query: FindDamageLocalsQuery,
  ): Promise<FindDamageLocalsQueryResult> {
    const result = await this.damageLocalRepo.findAllPaginated(query);

    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
