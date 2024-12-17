import { match } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { KeycloakDeviceAuthInitResponse } from '@libs/keycloak/interfaces';
import { KeycloakError } from '@libs/keycloak/keycloak.error';
import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { InitDeviceAuthorizationCommand } from './init-device-authorization.command';
import { InitDeviceAuthorizationResponseDto } from './init-device-authorization.response.dto';
import { InitDeviceAuthorizationServiceResult } from './init-device-authorization.service';

@Controller(routesV1.version)
export class InitDeviceAuthorizationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags('[APP] Authentication')
  @ApiOperation({
    summary: '[MOBILE] Init device authorization',
    description: 'OAuth 2.0 Device Authorization Grant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InitDeviceAuthorizationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: KeycloakError.name,
    type: ApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post(routesV1.auth.deviceAuth)
  async initDeviceAuthorization(): Promise<InitDeviceAuthorizationResponseDto> {
    const command = new InitDeviceAuthorizationCommand();

    const result: InitDeviceAuthorizationServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: KeycloakDeviceAuthInitResponse) =>
        new InitDeviceAuthorizationResponseDto(data),
      Err: (error: Error) => {
        if (error instanceof KeycloakError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.name,
          });
        }

        throw error;
      },
    });
  }
}
