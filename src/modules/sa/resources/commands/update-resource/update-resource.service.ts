import { CommandHandler } from '@nestjs/cqrs';
import { UpdateResourceCommand } from './update-resource.command';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Result, Ok, Err } from 'oxide.ts';
import {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
} from '../../domain/resource.error';

export type UpdateResourceCommandResult = Result<
  ResourceResponseDto,
  ResourceNotFoundError | ResourceAlreadyExistsError
>;

@CommandHandler(UpdateResourceCommand)
export class UpdateResourceService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    command: UpdateResourceCommand,
  ): Promise<UpdateResourceCommandResult> {
    try {
      await this.keycloakAdminService.updateResource(command.resourceId, {
        name: command.name,
        displayName: command.displayName,
        attributes: command.attributes,
        scopes: command.scopes,
      });

      return Ok({
        id: command.resourceId,
        name: command.name,
        displayName: command.displayName,
        attributes: command.attributes,
        scopes: command.scopes,
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        return Err(new ResourceAlreadyExistsError(error));
      }
      if (error.response.status === 404) {
        return Err(new ResourceNotFoundError(error));
      }
      throw error;
    }
  }
}
