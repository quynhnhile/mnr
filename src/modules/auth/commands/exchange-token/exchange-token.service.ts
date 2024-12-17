import { Err, Ok, Result } from 'oxide.ts';
import { KeycloakExchangeTokenResponse } from '@libs/keycloak/interfaces';
import { KeycloakError } from '@libs/keycloak/keycloak.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExchangeTokenCommand } from './exchange-token.command';
import { KeycloakService } from '@src/libs/keycloak/services/keycloak.service';

export type ExchangeTokenServiceResult = Result<
  KeycloakExchangeTokenResponse,
  KeycloakError
>;

@CommandHandler(ExchangeTokenCommand)
export class ExchangeTokenService implements ICommandHandler {
  constructor(private readonly _keycloakService: KeycloakService) {}

  async execute(
    command: ExchangeTokenCommand,
  ): Promise<ExchangeTokenServiceResult> {
    try {
      const data = await this._keycloakService.exchangeAuthorizationCode(
        command.code,
        command.redirectUri,
      );

      return Ok(data);
    } catch (error: any) {
      return Err(error);
    }
  }
}
