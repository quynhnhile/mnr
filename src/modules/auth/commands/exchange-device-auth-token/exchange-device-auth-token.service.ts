import { Err, Ok, Result } from 'oxide.ts';
import { KeycloakExchangeTokenResponse } from '@libs/keycloak/interfaces';
import { KeycloakError } from '@libs/keycloak/keycloak.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExchangeDeviceAuthTokenCommand } from './exchange-device-auth-token.command';
import { KeycloakService } from '@src/libs/keycloak/services/keycloak.service';

export type ExchangeDeviceAuthTokenServiceResult = Result<
  KeycloakExchangeTokenResponse,
  KeycloakError
>;

@CommandHandler(ExchangeDeviceAuthTokenCommand)
export class ExchangeDeviceAuthorizationTokenService
  implements ICommandHandler
{
  constructor(private readonly _keycloakService: KeycloakService) {}

  async execute(
    command: ExchangeDeviceAuthTokenCommand,
  ): Promise<ExchangeDeviceAuthTokenServiceResult> {
    try {
      const data = await this._keycloakService.exchangeDeviceAuthorization(
        command.deviceCode,
      );

      return Ok(data);
    } catch (error: any) {
      return Err(error);
    }
  }
}
