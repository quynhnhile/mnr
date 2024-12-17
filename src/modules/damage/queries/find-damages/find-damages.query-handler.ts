import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { DAMAGE_REPOSITORY } from '@modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@modules/damage/database/damage.repository.port';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindDamagesQuery extends PrismaPaginatedQueryBase<Prisma.DamageWhereInput> {}

export type FindDamagesQueryResult = Result<Paginated<DamageEntity>, void>;

@QueryHandler(FindDamagesQuery)
export class FindDamagesQueryHandler implements IQueryHandler {
  constructor(
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort,
  ) {}

  async execute(query: FindDamagesQuery): Promise<FindDamagesQueryResult> {
    const result = await this.damageRepo.findAllPaginated(query);

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
