import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { RoleResponseDto } from '../../dtos/role.response.dto';

export class FindRolesQuery {}

@QueryHandler(FindRolesQuery)
export class FindRolesQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(): Promise<RoleResponseDto[]> {
    const result = await this.keycloakAdminService.findRoles();
    return result
      .filter((item) => item.name !== 'uma_protection')
      .map((item) => {
        return {
          id: item.id,
          roleName: item.name,
          description: item.description,
        };
      });
  }
}
