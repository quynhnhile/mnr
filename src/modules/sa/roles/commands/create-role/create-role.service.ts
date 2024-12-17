import { CommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from './create-role.command';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { RoleAlreadyExistsError } from '../../domain/role.error';
import { Err, Ok, Result } from 'oxide.ts';
import { RoleResponseDto } from '../../dtos/role.response.dto';

export type CreateRoleCommandResult = Result<
  RoleResponseDto,
  RoleAlreadyExistsError
>;

@CommandHandler(CreateRoleCommand)
export class CreateRoleService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(command: CreateRoleCommand): Promise<CreateRoleCommandResult> {
    try {
      const result = await this.keycloakAdminService.createRole({
        name: command.roleName,
        description: command.description,
      });
      return Ok(result);
    } catch (error: any) {
      if (error.response.status === 409) {
        return Err(new RoleAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
