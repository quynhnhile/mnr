import { CommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordUserCommand } from './update-password-user.command';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Result, Ok, Err } from 'oxide.ts';
import { UserNotFoundError } from '../../domain/user.error';
import { RequestUser } from '@src/modules/auth/domain/value-objects/request-user.value-object';

export type UpdatePasswordUserCommandResult = Result<
  UserResponseDto,
  UserNotFoundError
>;

@CommandHandler(UpdatePasswordUserCommand)
export class UpdatePasswordUserService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    user: RequestUser,
    command: UpdatePasswordUserCommand,
  ): Promise<UpdatePasswordUserCommandResult> {
    const findUser = await this.keycloakAdminService.findOneUser(
      command.userId,
    );
    if (!findUser) {
      return Err(new UserNotFoundError());
    }

    command.credentials?.map((item) => {
      return {
        temporary: false,
        value: item.value,
      };
    });

    try {
      await this.keycloakAdminService.updateUser(user.id, {
        credentials: command.credentials,
      });

      await this.keycloakAdminService.logout(user.id);

      return Ok({});
    } catch (error: any) {
      if (error.response.status === 404) {
        return Err(new UserNotFoundError(error));
      }
      throw error;
    }
  }
}
