import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';

export class FindResourcesQuery {}

@QueryHandler(FindResourcesQuery)
export class FindResourcesQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(): Promise<ResourceResponseDto[]> {
    const result = await this.keycloakAdminService.findResources();

    return result
      .filter((item) => item.name !== 'Default Resource')
      .map((item) => {
        return {
          id: item._id,
          name: item.name,
          displayName: item.displayName,
          attributes: item.attributes,
          scopes: item.scopes,
        };
      });
  }
}
