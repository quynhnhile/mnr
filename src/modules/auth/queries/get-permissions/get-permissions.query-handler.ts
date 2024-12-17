import { Ok, Result } from 'oxide.ts';
import { QueryBase } from '@libs/ddd/query.base';
import {
  RequestUser,
  RequestUserPermissions,
} from '@modules/auth/domain/value-objects/request-user.value-object';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetPermissionsQuery extends QueryBase {
  readonly user: RequestUser;

  constructor(user: RequestUser) {
    super();
    this.user = user;
  }
}

@QueryHandler(GetPermissionsQuery)
export class GetPermissionsQueryHandler implements IQueryHandler {
  async execute(
    query: GetPermissionsQuery,
  ): Promise<Result<RequestUserPermissions[], Error>> {
    return Ok(query.user.permissions);
  }
}
