import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContSizeMapNotFoundError } from '@modules/cont-size-map/domain/cont-size-map.error';
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
import { DeleteContSizeMapCommand } from './delete-cont-size-map.command';
import { DeleteContSizeMapCommandResult } from './delete-cont-size-map.service';

@Controller(routesV1.version)
export class DeleteContSizeMapHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CONT_SIZE_MAP.parent} - ${resourcesV1.CONT_SIZE_MAP.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a ContSizeMap' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ContSizeMap ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'ContSizeMap deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ContSizeMapNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONT_SIZE_MAP.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.contSizeMap.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') contSizeMapId: bigint): Promise<void> {
    const command = new DeleteContSizeMapCommand({ contSizeMapId });
    const result: DeleteContSizeMapCommandResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ContSizeMapNotFoundError) {
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
