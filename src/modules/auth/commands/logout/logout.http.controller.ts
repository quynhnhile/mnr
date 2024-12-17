import { routesV1 } from '@config/app.routes';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LogoutRequestDto } from './logout.request.dto';
import { LogoutCommand } from './logout.command';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(routesV1.version)
export class LogoutHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout user and remove sessions from Keycloak',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(routesV1.auth.logout)
  async logout(@Body() body: LogoutRequestDto): Promise<void> {
    const command = new LogoutCommand(body);

    await this.commandBus.execute(command);
  }
}
