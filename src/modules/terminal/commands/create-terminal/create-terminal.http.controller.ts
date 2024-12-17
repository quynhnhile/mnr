import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TerminalCodeAlreadyExistsError } from '@modules/terminal/domain/terminal.error';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import { TerminalResponseDto } from '@modules/terminal/dtos/terminal.response.dto';
import { TerminalMapper } from '@modules/terminal/mappers/terminal.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTerminalCommand } from './create-terminal.command';
import { CreateTerminalRequestDto } from './create-terminal.request.dto';
import { CreateTerminalServiceResult } from './create-terminal.service';

@Controller(routesV1.version)
export class CreateTerminalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: TerminalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TERMINAL.parent} - ${resourcesV1.TERMINAL.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Terminal' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TerminalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TerminalCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TERMINAL.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.terminal.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateTerminalRequestDto,
  ): Promise<TerminalResponseDto> {
    const command = new CreateTerminalCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateTerminalServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (terminal: TerminalEntity) => this.mapper.toResponse(terminal),
      Err: (error: Error) => {
        if (error instanceof TerminalCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
