import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';

export class FindUsersQuery {}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(): Promise<UserResponseDto[]> {
    const find = await this.keycloakAdminService.findUsers();
    const rs: UserResponseDto[] = [];
    for (let j = 0; j < find.length; j++) {
      const userId = find[j].id;
      const grp: RoleMappingPayload[] = [];
      if (userId) {
        const allGroups = await this.keycloakAdminService.listRolesOfUser(
          userId,
        );
        for (let i = 0; i < allGroups.length; i++) {
          if (allGroups[i].id && allGroups[i].name)
            grp.push({
              id: allGroups[i].id,
              name: allGroups[i].name,
            });
        }
      }
      rs.push({
        id: find[j].id,
        username: find[j].username,
        firstName: find[j].firstName,
        lastName: find[j].lastName,
        email: find[j].email,
        emailVerified: find[j].emailVerified,
        attributes: find[j].attributes,
        enabled: find[j].enabled,
        groups: grp,
        createdTimestamp: find[j].createdTimestamp,
      });
    }
    const result = rs.filter((item) => item.username !== 'uma_protection');
    return result;
  }
}
