import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { RoleNotFoundError } from '../../domain/role.error';
import { Err, Ok, Result } from 'oxide.ts';
import { RoleResponseDto } from '../../dtos/role.response.dto';

export class FindRoleQuery {
  roleName: string;

  constructor(public readonly rn: string) {
    this.roleName = rn;
  }
}
export type FindRoleQueryResult = Result<RoleResponseDto, RoleNotFoundError>;

@QueryHandler(FindRoleQuery)
export class FindRoleQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(query: FindRoleQuery): Promise<FindRoleQueryResult> {
    const result = await this.keycloakAdminService.findRole(query.roleName);
    if (!result || result.name === 'uma_protection') {
      return Err(new RoleNotFoundError());
    }
    return Ok({
      id: result.id,
      roleName: result.name,
      description: result.description,
    });
  }
}
