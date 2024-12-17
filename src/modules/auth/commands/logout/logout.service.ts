import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { KeycloakService } from '@src/libs/keycloak/services/keycloak.service';

@CommandHandler(LogoutCommand)
export class LogoutService implements ICommandHandler {
  constructor(private readonly _keycloakService: KeycloakService) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this._keycloakService.logout(command.token, command.refreshToken);
  }
}
