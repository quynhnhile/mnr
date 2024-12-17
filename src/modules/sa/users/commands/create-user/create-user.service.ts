import { CommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserAlreadyExistsError } from '../../domain/user.error';
import { Err, Ok, Result } from 'oxide.ts';
import { RoleNotFoundError } from '@src/modules/sa/roles/domain/role.error';

export type CreateUserCommandResult = Result<
  UserResponseDto,
  UserAlreadyExistsError | RoleNotFoundError
>;

@CommandHandler(CreateUserCommand)
export class CreateUserService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    const invalidRoles = await Promise.all(
      command.groups.map(async (item) => {
        const checkGroup = await this.keycloakAdminService.findRole(item.name);
        if (!checkGroup) return item.name;
      }),
    );

    const rs = invalidRoles.filter((item) => {
      return item !== undefined;
    });
    if (rs.length > 0) {
      return Err(new RoleNotFoundError());
    }

    command.credentials.map((item) => {
      return {
        temporary: false,
        value: item.value,
      };
    });

    try {
      const user = await this.keycloakAdminService.createUser({
        username: command.username,
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        emailVerified: command.emailVerified,
        attributes: command.attributes,
        enabled: command.enabled,
        credentials: command.credentials,
      });

      await this.keycloakAdminService.addClientRoleMappings(
        user.id,
        command.groups,
      );

      return Ok({
        id: user.id,
        username: command.username,
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        emailVerified: command.emailVerified,
        attributes: command.attributes,
        enabled: command.enabled,
        groups: command.groups,
        // credentials: credentials,
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
