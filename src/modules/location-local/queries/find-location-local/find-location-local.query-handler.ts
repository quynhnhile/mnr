import { Err, Ok, Result } from 'oxide.ts';
import { LOCATION_LOCAL_REPOSITORY } from '@modules/location-local/location-local.di-tokens';
import { LocationLocalRepositoryPort } from '@modules/location-local/database/location-local.repository.port';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import { LocationLocalNotFoundError } from '@modules/location-local/domain/location-local.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindLocationLocalQuery {
  locationLocalId: bigint;

  constructor(public readonly id: bigint) {
    this.locationLocalId = id;
  }
}

export type FindLocationLocalQueryResult = Result<LocationLocalEntity, LocationLocalNotFoundError>;

@QueryHandler(FindLocationLocalQuery)
export class FindLocationLocalQueryHandler implements IQueryHandler {
  constructor(
    @Inject(LOCATION_LOCAL_REPOSITORY)
    protected readonly locationLocalRepo: LocationLocalRepositoryPort
  ) {}

  async execute(query: FindLocationLocalQuery): Promise<FindLocationLocalQueryResult> {
    const found = await this.locationLocalRepo.findOneById(query.locationLocalId);
    if (found.isNone()) return Err(new LocationLocalNotFoundError());

    return Ok(found.unwrap());
  }
}
