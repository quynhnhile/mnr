import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import {
  TerminalNotFoundError,
  TerminalCodeAlreadyExistsError,
  TerminalCodeAlreadyInUseError,
} from '@modules/terminal/domain/terminal.error';
import { TerminalResponseDto } from '@modules/terminal/dtos/terminal.response.dto';
import { TerminalMapper } from '@modules/terminal/mappers/terminal.mapper';
import {
  BadRequestException,
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTerminalCommand } from './update-terminal.command';
import { UpdateTerminalRequestDto } from './update-terminal.request.dto';
import { UpdateTerminalServiceResult } from './update-terminal.service';

@Controller(routesV1.version)
export class UpdateTerminalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: TerminalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TERMINAL.parent} - ${resourcesV1.TERMINAL.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Terminal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Terminal ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TerminalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TerminalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: TerminalCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TerminalCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TERMINAL.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.terminal.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') terminalId: bigint,
    @Body() body: UpdateTerminalRequestDto,
  ): Promise<TerminalResponseDto> {
    const command = new UpdateTerminalCommand({
      terminalId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateTerminalServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (terminal: TerminalEntity) => this.mapper.toResponse(terminal),
      Err: (error: Error) => {
        if (error instanceof TerminalNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof TerminalCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof TerminalCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
