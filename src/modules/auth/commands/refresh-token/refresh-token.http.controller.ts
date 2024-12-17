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
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenRequestDto } from './refresh-token.request.dto';
import { RefreshTokenServiceResult } from './refresh-token.service';

@Controller(routesV1.version)
export class RefreshTokenHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Exchange refresh token for access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ExchangeTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: KeycloakError.name,
    type: ApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post(routesV1.auth.refreshToken)
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<ExchangeTokenResponseDto> {
    const command = new RefreshTokenCommand({
      refreshToken: body.refreshToken,
    });
    const result: RefreshTokenServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (data: KeycloakExchangeTokenResponse) =>
        new ExchangeTokenResponseDto(data),
      Err: (error: Error) => {
        throw new BadRequestException({
          message: error.message,
          errorCode: error.name,
        });

        throw error;
      },
    });
  }
}
