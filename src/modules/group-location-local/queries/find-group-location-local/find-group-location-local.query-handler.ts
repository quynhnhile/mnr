import { Err, Ok, Result } from 'oxide.ts';
import { GROUP_LOCATION_LOCAL_REPOSITORY } from '@modules/group-location-local/group-location-local.di-tokens';
import { GroupLocationLocalRepositoryPort } from '@modules/group-location-local/database/group-location-local.repository.port';
import { GroupLocationLocalEntity } from '@modules/group-location-local/domain/group-location-local.entity';
import { GroupLocationLocalNotFoundError } from '@modules/group-location-local/domain/group-location-local.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindGroupLocationLocalQuery {
  groupLocationLocalId: bigint;

  constructor(public readonly id: bigint) {
    this.groupLocationLocalId = id;
  }
}

export type FindGroupLocationLocalQueryResult = Result<GroupLocationLocalEntity, GroupLocationLocalNotFoundError>;

@QueryHandler(FindGroupLocationLocalQuery)
export class FindGroupLocationLocalQueryHandler implements IQueryHandler {
  constructor(
    @Inject(GROUP_LOCATION_LOCAL_REPOSITORY)
    protected readonly groupLocationLocalRepo: GroupLocationLocalRepositoryPort
  ) {}

  async execute(query: FindGroupLocationLocalQuery): Promise<FindGroupLocationLocalQueryResult> {
    const found = await this.groupLocationLocalRepo.findOneById(query.groupLocationLocalId);
    if (found.isNone()) return Err(new GroupLocationLocalNotFoundError());

    return Ok(found.unwrap());
  }
}
