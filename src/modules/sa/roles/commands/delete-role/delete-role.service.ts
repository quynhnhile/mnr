import { CommandHandler } from '@nestjs/cqrs';
import { DeleteRoleCommand } from './delete-role.command';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Err, Ok, Result } from 'oxide.ts';
import { RoleNotFoundError } from '../../domain/role.error';

export type DeleteRoleCommandResult = Result<boolean, RoleNotFoundError>;
@CommandHandler(DeleteRoleCommand)
export class DeleteRoleService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    command: DeleteRoleCommand,
  ): Promise<DeleteRoleCommandResult | any> {
    try {
      const result = await this.keycloakAdminService.deleteRole(
        command.roleName,
      );
      return Ok(result);
    } catch (error: any) {
      if (error.response.status === 404) {
        return Err(new RoleNotFoundError(error));
      }

      throw error;
    }
  }
}
