import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { RoleNotFoundError } from '../../domain/role.error';
import { Err, Ok, Result } from 'oxide.ts';
import { FindUsersInRoleResponseDto } from './find-users-in-role.response.dto';
import UserRepresentation from '@src/libs/keycloak/defs/user-representation';

export class FindUsersInRoleQuery {
  roleName: string;

  constructor(public readonly rn: string) {
    this.roleName = rn;
  }
}
export type FindUsersInRoleQueryResult = Result<
  FindUsersInRoleResponseDto[],
  RoleNotFoundError
>;

@QueryHandler(FindUsersInRoleQuery)
export class FindUsersInRoleQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    query: FindUsersInRoleQuery,
  ): Promise<FindUsersInRoleQueryResult> {
    if (query.roleName === 'uma_protection') {
      return Err(new RoleNotFoundError());
    }
    const rs = await this.keycloakAdminService.findUsersWithRole(
      query.roleName,
    );
    const result: UserRepresentation[] = [];
    for (let i = 0; i < rs.length; i++) {
      result.push({
        id: rs[i].id,
        username: rs[i].username,
        firstName: rs[i].firstName,
        lastName: rs[i].lastName,
        email: rs[i].email,
        emailVerified: rs[i].emailVerified,
        attributes: rs[i].attributes,
        enabled: rs[i].enabled,
        createdTimestamp: rs[i].createdTimestamp,
      });
    }
    return Ok(result);
  }
}
