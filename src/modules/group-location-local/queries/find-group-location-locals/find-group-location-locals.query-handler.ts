import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { GROUP_LOCATION_LOCAL_REPOSITORY } from '@modules/group-location-local/group-location-local.di-tokens';
import { GroupLocationLocalRepositoryPort } from '@modules/group-location-local/database/group-location-local.repository.port';
import { GroupLocationLocalEntity } from '@modules/group-location-local/domain/group-location-local.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindGroupLocationLocalsQuery extends PrismaPaginatedQueryBase<Prisma.GroupLocationLocalWhereInput> {}

export type FindGroupLocationLocalsQueryResult = Result<
  Paginated<GroupLocationLocalEntity>,
  void
>;

@QueryHandler(FindGroupLocationLocalsQuery)
export class FindGroupLocationLocalsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(GROUP_LOCATION_LOCAL_REPOSITORY)
    protected readonly groupLocationLocalRepo: GroupLocationLocalRepositoryPort,
  ) {}

  async execute(
    query: FindGroupLocationLocalsQuery,
  ): Promise<FindGroupLocationLocalsQueryResult> {
    const result = await this.groupLocationLocalRepo.findAllPaginated(query);

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
