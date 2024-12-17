import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import { ComponentEntity } from '@modules/component/domain/component.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindComponentsQuery extends PrismaPaginatedQueryBase<Prisma.ComponentWhereInput> {}

export type FindComponentsQueryResult = Result<
  Paginated<ComponentEntity>,
  void
>;

@QueryHandler(FindComponentsQuery)
export class FindComponentsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    protected readonly componentRepo: ComponentRepositoryPort,
  ) {}

  async execute(
    query: FindComponentsQuery,
  ): Promise<FindComponentsQueryResult> {
    const result = await this.componentRepo.findAllPaginated(query);

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
