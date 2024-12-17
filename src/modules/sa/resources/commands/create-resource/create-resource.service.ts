import { CommandHandler } from '@nestjs/cqrs';
import { CreateResourceCommand } from './create-resource.command';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';
import { ResourceAlreadyExistsError } from '../../domain/resource.error';
import { Err, Ok, Result } from 'oxide.ts';

export type CreateResourceCommandResult = Result<
  ResourceResponseDto,
  ResourceAlreadyExistsError
>;

@CommandHandler(CreateResourceCommand)
export class CreateResourceService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    command: CreateResourceCommand,
  ): Promise<CreateResourceCommandResult> {
    try {
      const result = await this.keycloakAdminService.createResource({
        name: command.name,
        displayName: command.displayName,
        attributes: command.attributes,
        scopes: command.scopes,
      });
      return Ok({
        id: result._id,
        name: result.name,
        displayName: result.displayName,
        attributes: result.attributes,
        scopes: result.scopes,
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        return Err(new ResourceAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
