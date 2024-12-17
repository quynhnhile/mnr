import { CommandHandler } from '@nestjs/cqrs';
import { DeleteResourceCommand } from './delete-resource.command';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Err, Ok, Result } from 'oxide.ts';
import { ResourceNotFoundError } from '../../domain/resource.error';

export type DeleteResourceCommandResult = Result<
  boolean,
  ResourceNotFoundError
>;
@CommandHandler(DeleteResourceCommand)
export class DeleteResourceService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    command: DeleteResourceCommand,
  ): Promise<DeleteResourceCommandResult | any> {
    try {
      const result = await this.keycloakAdminService.deleteResource(
        command.resourceId,
      );
      return Ok(result);
    } catch (error: any) {
      if (error.response.status === 404) {
        return Err(new ResourceNotFoundError(error));
      }

      throw error;
    }
  }
}
