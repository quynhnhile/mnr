import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Err, Ok, Result } from 'oxide.ts';
import { ScopeResponseDto } from '../../dtos/scope.response.dto';
import { ScopeNotFoundError } from '../../domain/scope.error';

export class FindScopeQuery {
  scopeId: string;

  constructor(public readonly id: string) {
    this.scopeId = id;
  }
}
export type FindScopeQueryResult = Result<ScopeResponseDto, ScopeNotFoundError>;

@QueryHandler(FindScopeQuery)
export class FindScopeQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(query: FindScopeQuery): Promise<FindScopeQueryResult> {
    const result = await this.keycloakAdminService.findScope(query.scopeId);
    if (!result) {
      return Err(new ScopeNotFoundError());
    }
    return Ok({
      id: result.id,
      name: result.name,
    });
  }
}
