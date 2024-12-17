import { CommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from './update-role.command';
import { RoleResponseDto } from '../../dtos/role.response.dto';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Result, Ok, Err } from 'oxide.ts';
import {
  RoleAlreadyExistsError,
  RoleNotFoundError,
} from '../../domain/role.error';

export type UpdateRoleCommandResult = Result<
  RoleResponseDto,
  RoleNotFoundError | RoleAlreadyExistsError
>;

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(command: UpdateRoleCommand): Promise<UpdateRoleCommandResult> {
    try {
      await this.keycloakAdminService.updateRole(command.roleName, {
        description: command.description,
      });

      return Ok({
        roleName: command.roleName,
        description: command.description,
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        return Err(new RoleAlreadyExistsError(error));
      }
      if (error.response.status === 404) {
        return Err(new RoleNotFoundError(error));
      }
      throw error;
    }
  }
}
