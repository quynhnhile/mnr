import { CommandHandler } from '@nestjs/cqrs';
import { UpdateProfileUserCommand } from './update-profile-user.command';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Result, Ok, Err } from 'oxide.ts';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../domain/user.error';
import { RoleNotFoundError } from '@src/modules/sa/roles/domain/role.error';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';

export type UpdateProfileUserCommandResult = Result<
  UserResponseDto,
  UserNotFoundError | UserAlreadyExistsError | RoleNotFoundError
>;

@CommandHandler(UpdateProfileUserCommand)
export class UpdateProfileUserService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    command: UpdateProfileUserCommand,
  ): Promise<UpdateProfileUserCommandResult> {
    const findUser = await this.keycloakAdminService.findOneUser(
      command.userId,
    );
    if (!findUser) {
      return Err(new UserNotFoundError());
    }
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

    const listRolesOfUser = await this.keycloakAdminService.listRolesOfUser(
      command.userId,
    );

    const listroleName = listRolesOfUser.map((item) => {
      return item.name;
    });
    const commandRoleName = command.groups.map((item) => {
      return item.name;
    });

    // trong command.groups, lọc ra các role không có trong listRolesOfUser để add thêm vào
    const addRole = commandRoleName.filter(
      (item) => !listroleName.includes(item),
    );
    const returnAddRole: RoleMappingPayload[] = [];
    for (let i = 0; i < addRole.length; i++) {
      const findAddRole = await this.keycloakAdminService.findRole(addRole[i]);
      if (findAddRole) {
        if (findAddRole.id && findAddRole.name)
          returnAddRole.push({
            id: findAddRole.id,
            name: findAddRole.name,
          });
      }
    }

    // trong listRolesOfUser, lọc ra các role không có trong command.groups để xóa đi
    const delRole = listroleName.filter(
      (item) => !commandRoleName.includes(item),
    );
    const returnDelRole: RoleMappingPayload[] = [];
    for (let j = 0; j < delRole.length; j++) {
      const findDelRole = await this.keycloakAdminService.findRole(delRole[j]);
      if (findDelRole) {
        if (findDelRole.id && findDelRole.name)
          returnDelRole.push({
            id: findDelRole.id,
            name: findDelRole.name,
          });
      }
    }

    try {
      await this.keycloakAdminService.updateUser(command.userId, {
        firstName: command.firstName,
        lastName: command.lastName,
        emailVerified: command.emailVerified,
        attributes: command.attributes,
        enabled: command.enabled,
      });

      // add role
      if (addRole.length > 0) {
        await this.keycloakAdminService.addClientRoleMappings(
          command.userId,
          returnAddRole,
        );
      }

      // del role
      if (delRole.length > 0) {
        await this.keycloakAdminService.deleteClientRoleMappings(
          command.userId,
          returnDelRole,
        );
      }

      return Ok({
        id: command.userId,
        firstName: command.firstName,
        lastName: command.lastName,
        emailVerified: command.emailVerified,
        attributes: command.attributes,
        enabled: command.enabled,
        groups: command.groups,
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        return Err(new UserAlreadyExistsError(error));
      }
      if (error.response.status === 404) {
        return Err(new UserNotFoundError(error));
      }
      throw error;
    }
  }
}
