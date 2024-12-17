import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Err, Ok, Result } from 'oxide.ts';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserNotFoundError } from '../../domain/user.error';

export class FindUserQuery {
  userId: string;

  constructor(public readonly id: string) {
    this.userId = id;
  }
}
export type FindUserQueryResult = Result<UserResponseDto, UserNotFoundError>;

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(query: FindUserQuery): Promise<FindUserQueryResult> {
    const result = await this.keycloakAdminService.findOneUser(query.userId);
    if (!result || result.username === 'uma_protection') {
      return Err(new UserNotFoundError());
    }
    const findRole = await this.keycloakAdminService.listRolesOfUser(
      query.userId,
    );
    const group = findRole.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    return Ok({
      id: query.userId,
      username: result.username,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      emailVerified: result.emailVerified,
      attributes: result.attributes,
      enabled: result.enabled,
      group: group,
      createdTimestamp: result.createdTimestamp,
    });
  }
}
