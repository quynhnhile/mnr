import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  OperationCodeAlreadyInUseError,
  OperationNotFoundError,
} from '@modules/operation/domain/operation.error';
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
import { DeleteOperationCommand } from './delete-operation.command';
import { DeleteOperationServiceResult } from './delete-operation.service';

@Controller(routesV1.version)
export class DeleteOperationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.OPERATION.parent} - ${resourcesV1.OPERATION.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Operation' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Operation ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Operation deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: OperationCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.OPERATION.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.operation.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') operationId: bigint): Promise<void> {
    const command = new DeleteOperationCommand({ operationId });
    const result: DeleteOperationServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof OperationCodeAlreadyInUseError) {
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
