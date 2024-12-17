import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { ScopeResponseDto } from '../../dtos/scope.response.dto';

export class FindScopesQuery {}

@QueryHandler(FindScopesQuery)
export class FindScopesQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(): Promise<ScopeResponseDto[]> {
    const result = await this.keycloakAdminService.findScopes();
    return result.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  }
}
