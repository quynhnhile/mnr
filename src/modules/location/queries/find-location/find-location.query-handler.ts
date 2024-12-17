import { Err, Ok, Result } from 'oxide.ts';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationEntity } from '@modules/location/domain/location.entity';
import { LocationNotFoundError } from '@modules/location/domain/location.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindLocationQuery {
  locationId: bigint;

  constructor(public readonly id: bigint) {
    this.locationId = id;
  }
}

export type FindLocationQueryResult = Result<
  LocationEntity,
  LocationNotFoundError
>;

@QueryHandler(FindLocationQuery)
export class FindLocationQueryHandler implements IQueryHandler {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    protected readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(query: FindLocationQuery): Promise<FindLocationQueryResult> {
    const found = await this.locationRepo.findOneById(query.locationId);
    if (found.isNone()) return Err(new LocationNotFoundError());

    return Ok(found.unwrap());
  }
}
