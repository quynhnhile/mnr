import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationEntity } from '@modules/location/domain/location.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindLocationsQuery extends PrismaPaginatedQueryBase<Prisma.LocationWhereInput> {}

export type FindLocationsQueryResult = Result<Paginated<LocationEntity>, void>;

@QueryHandler(FindLocationsQuery)
export class FindLocationsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    protected readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(query: FindLocationsQuery): Promise<FindLocationsQueryResult> {
    const result = await this.locationRepo.findAllPaginated(query);

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
