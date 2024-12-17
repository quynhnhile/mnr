import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  TerminalNotFoundError,
  TerminalCodeAlreadyInUseError,
} from '@modules/terminal/domain/terminal.error';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
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
import { DeleteTerminalCommand } from './delete-terminal.command';
import { DeleteTerminalServiceResult } from './delete-terminal.service';

@Controller(routesV1.version)
export class DeleteTerminalHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.TERMINAL.parent} - ${resourcesV1.TERMINAL.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Terminal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Terminal ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Terminal deleted',
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
  @AuthPermission(resourcesV1.TERMINAL.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.terminal.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') terminalId: bigint): Promise<void> {
    const command = new DeleteTerminalCommand({ terminalId });
    const result: DeleteTerminalServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof TerminalNotFoundError) {
          throw new NotFoundHttpException({
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
