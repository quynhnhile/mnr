import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { LOCATION_LOCAL_REPOSITORY } from '@modules/location-local/location-local.di-tokens';
import { LocationLocalRepositoryPort } from '@modules/location-local/database/location-local.repository.port';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindLocationLocalsQuery extends PrismaPaginatedQueryBase<Prisma.LocationLocalWhereInput> {}

export type FindLocationLocalsQueryResult = Result<
  Paginated<LocationLocalEntity>,
  void
>;

@QueryHandler(FindLocationLocalsQuery)
export class FindLocationLocalsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(LOCATION_LOCAL_REPOSITORY)
    protected readonly locationLocalRepo: LocationLocalRepositoryPort,
  ) {}

  async execute(
    query: FindLocationLocalsQuery,
  ): Promise<FindLocationLocalsQueryResult> {
    const result = await this.locationLocalRepo.findAllPaginated(query);

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
