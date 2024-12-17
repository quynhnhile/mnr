import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  CleanMethodCodeAlreadyInUseError,
  CleanMethodNotFoundError,
} from '@modules/clean-method/domain/clean-method.error';
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
import { DeleteCleanMethodCommand } from './delete-clean-method.command';
import { DeleteCleanMethodServiceResult } from './delete-clean-method.service';

@Controller(routesV1.version)
export class DeleteCleanMethodHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CLEAN_METHOD.parent} - ${resourcesV1.CLEAN_METHOD.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a CleanMethod' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'CleanMethod ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'CleanMethod deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CleanMethodNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CleanMethodCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_METHOD.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.cleanMethod.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') cleanMethodId: bigint): Promise<void> {
    const command = new DeleteCleanMethodCommand({ cleanMethodId });
    const result: DeleteCleanMethodServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof CleanMethodNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof CleanMethodCodeAlreadyInUseError) {
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
