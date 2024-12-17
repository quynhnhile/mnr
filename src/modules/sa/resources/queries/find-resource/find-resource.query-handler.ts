import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Err, Ok, Result } from 'oxide.ts';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';
import { ResourceNotFoundError } from '../../domain/resource.error';

export class FindResourceQuery {
  resourceId: string;

  constructor(public readonly id: string) {
    this.resourceId = id;
  }
}
export type FindResourceQueryResult = Result<
  ResourceResponseDto,
  ResourceNotFoundError
>;

@QueryHandler(FindResourceQuery)
export class FindResourceQueryHandler implements IQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(query: FindResourceQuery): Promise<FindResourceQueryResult> {
    const result = await this.keycloakAdminService.findResource(
      query.resourceId,
    );
    if (!result || result.name === 'Default Resource') {
      return Err(new ResourceNotFoundError());
    }

    return Ok({
      id: result._id,
      name: result.name,
      displayName: result.displayName,
      attributes: result.attributes,
      scopes: result.scopes,
    });
  }
}
