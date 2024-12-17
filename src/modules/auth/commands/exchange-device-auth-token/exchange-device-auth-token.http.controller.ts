import { match } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { KeycloakError } from '@libs/keycloak/keycloak.error';
import { ExchangeTokenResponseDto } from '@modules/auth/dtos/exchange-token.response.dto';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KeycloakExchangeTokenResponse } from '@src/libs/keycloak/interfaces';
import { ExchangeDeviceAuthTokenCommand } from './exchange-device-auth-token.command';
import { ExchangeDeviceAuthTokenRequestDto } from './exchange-device-auth-token.request.dto';
import { ExchangeDeviceAuthTokenServiceResult } from './exchange-device-auth-token.service';

@Controller(routesV1.version)
export class ExchangeDeviceAuthTokenHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags('[APP] Authentication')
  @ApiOperation({
    summary: '[APP] Exchange device authorization token',
    description: 'OAuth 2.0 Device Authorization Grant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ExchangeTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The authorization request is still pending. (User has not yet completed the authorization on the browser)',
    type: ApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post(routesV1.auth.deviceAuthExchange)
  async exchangeDeviceAuthToken(
    @Body() body: ExchangeDeviceAuthTokenRequestDto,
  ): Promise<ExchangeTokenResponseDto> {
    const command = new ExchangeDeviceAuthTokenCommand({
      deviceCode: body.deviceCode,
    });

    const result: ExchangeDeviceAuthTokenServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: KeycloakExchangeTokenResponse) =>
        new ExchangeTokenResponseDto(data),
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
