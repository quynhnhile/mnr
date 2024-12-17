import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindContainersQuery extends PrismaPaginatedQueryBase<Prisma.ContainerWhereInput> {}

export type FindContainersQueryResult = Result<
  Paginated<ContainerEntity>,
  void
>;

@QueryHandler(FindContainersQuery)
export class FindContainersQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
  ) {}

  async execute(
    query: FindContainersQuery,
  ): Promise<FindContainersQueryResult> {
    const result = await this.containerRepo.findAllPaginated(query);

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
