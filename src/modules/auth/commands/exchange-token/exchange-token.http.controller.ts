import { match } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { KeycloakExchangeTokenResponse } from '@libs/keycloak/interfaces/keycloak-exchange-token-response.interface';
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
import { ExchangeTokenCommand } from './exchange-token.command';
import { ExchangeTokenRequestDto } from './exchange-token.request.dto';
import { ExchangeTokenServiceResult } from './exchange-token.service';

@Controller(routesV1.version)
export class ExchangeTokenHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'Exchange token',
    description: 'Exchange authorization code for access token',
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
  @Post(routesV1.auth.exchangeToken)
  async exchangeToken(
    @Body() body: ExchangeTokenRequestDto,
  ): Promise<ExchangeTokenResponseDto> {
    const command = new ExchangeTokenCommand(body);
    const result: ExchangeTokenServiceResult = await this.commandBus.execute(
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
