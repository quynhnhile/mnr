import { Result, match } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { InvalidTokenError } from '@modules/auth/domain/auth.error';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { LoginResponseDto } from '@modules/auth/dtos/login.response.dto';
import { KeycloakAuthGuard } from '@modules/auth/guards';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginCommand } from './login.command';

@Controller(routesV1.version)
export class LoginHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'Login',
    description: 'Testing login with Keycloak.',
  })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Post(routesV1.auth.login)
  async login(@ReqUser() user: RequestUser): Promise<LoginResponseDto> {
    const command = new LoginCommand(user);
    console.log(user);

    const result: Result<LoginResponseDto, InvalidTokenError> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: LoginResponseDto) => data,
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
