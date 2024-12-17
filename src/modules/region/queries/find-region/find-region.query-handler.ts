import { Err, Ok, Result } from 'oxide.ts';
import { REGION_REPOSITORY } from '@modules/region/region.di-tokens';
import { RegionRepositoryPort } from '@modules/region/database/region.repository.port';
import { RegionEntity } from '@modules/region/domain/region.entity';
import { RegionNotFoundError } from '@modules/region/domain/region.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindRegionQuery {
  regionId: bigint;

  constructor(public readonly id: bigint) {
    this.regionId = id;
  }
}

export type FindRegionQueryResult = Result<RegionEntity, RegionNotFoundError>;

@QueryHandler(FindRegionQuery)
export class FindRegionQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REGION_REPOSITORY)
    protected readonly regionRepo: RegionRepositoryPort,
  ) {}

  async execute(query: FindRegionQuery): Promise<FindRegionQueryResult> {
    const found = await this.regionRepo.findOneById(query.regionId);
    if (found.isNone()) return Err(new RegionNotFoundError());

    return Ok(found.unwrap());
  }
}
