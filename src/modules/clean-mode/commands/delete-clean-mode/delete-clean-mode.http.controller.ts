import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  CleanModeCodeAlreadyInUseError,
  CleanModeNotFoundError,
} from '@modules/clean-mode/domain/clean-mode.error';
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
import { DeleteCleanModeCommand } from './delete-clean-mode.command';
import { DeleteCleanModeServiceResult } from './delete-clean-mode.service';

@Controller(routesV1.version)
export class DeleteCleanModeHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CLEAN_MODE.parent} - ${resourcesV1.CLEAN_MODE.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a CleanMode' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'CleanMode ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'CleanMode deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CleanModeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CleanModeCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_MODE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.cleanMode.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') cleanModeId: bigint): Promise<void> {
    const command = new DeleteCleanModeCommand({ cleanModeId });
    const result: DeleteCleanModeServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof CleanModeNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof CleanModeCodeAlreadyInUseError) {
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
