import { Err, Ok, Result } from 'oxide.ts';
import { KeycloakDeviceAuthInitResponse } from '@libs/keycloak/interfaces';
import { KeycloakError } from '@libs/keycloak/keycloak.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitDeviceAuthorizationCommand } from './init-device-authorization.command';
import { KeycloakService } from '@src/libs/keycloak/services/keycloak.service';

export type InitDeviceAuthorizationServiceResult = Result<
  KeycloakDeviceAuthInitResponse,
  KeycloakError
>;

@CommandHandler(InitDeviceAuthorizationCommand)
export class InitDeviceAuthorizationService implements ICommandHandler {
  constructor(private readonly _keycloakService: KeycloakService) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: InitDeviceAuthorizationCommand,
  ): Promise<InitDeviceAuthorizationServiceResult> {
    try {
      const data = await this._keycloakService.initiateDeviceAuthorization();

      return Ok(data);
    } catch (error: any) {
      return Err(error);
    }
  }
}
