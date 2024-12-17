import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContainerNotFoundError } from '@modules/container/domain/container.error';
import {
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
import { DeleteContainerCommand } from './delete-container.command';
import { DeleteContainerCommandResult } from './delete-container.service';

@Controller(routesV1.version)
export class DeleteContainerHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CONTAINER.parent} - ${resourcesV1.CONTAINER.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Container' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Container ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Container deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ContainerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONTAINER.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.container.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') containerId: bigint): Promise<void> {
    const command = new DeleteContainerCommand({ containerId });
    const result: DeleteContainerCommandResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ContainerNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
