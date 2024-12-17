import { Err, Ok, Result } from 'oxide.ts';
import { KeycloakExchangeTokenResponse } from '@libs/keycloak/interfaces';
import { KeycloakError } from '@libs/keycloak/keycloak.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { KeycloakService } from '@src/libs/keycloak/services/keycloak.service';

export type RefreshTokenServiceResult = Result<
  KeycloakExchangeTokenResponse,
  KeycloakError
>;

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenService implements ICommandHandler {
  constructor(private readonly _keycloakService: KeycloakService) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenServiceResult> {
    try {
      const data = await this._keycloakService.refreshToken(
        command.refreshToken,
      );

      return Ok(data);
    } catch (error: any) {
      return Err(error);
    }
  }
}
