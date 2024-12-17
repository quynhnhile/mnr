import { CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import { Err, Ok, Result } from 'oxide.ts';
import { UserNotFoundError } from '../../domain/user.error';

export type DeleteUserCommandResult = Result<boolean, UserNotFoundError>;
@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(
    command: DeleteUserCommand,
  ): Promise<DeleteUserCommandResult | any> {
    const findUser = await this.keycloakAdminService.findOneUser(
      command.userId,
    );
    if (!findUser) {
      return Err(new UserNotFoundError());
    }
    try {
      const result = await this.keycloakAdminService.deleteUser(command.userId);
      return Ok(result);
    } catch (error: any) {
      if (error.response.status === 404) {
        return Err(new UserNotFoundError(error));
      }

      throw error;
    }
  }
}
