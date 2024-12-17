import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  GroupLocationLocalCodeAlreadyInUseError,
  GroupLocationLocalNotFoundError,
} from '@modules/group-location-local/domain/group-location-local.error';
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
import { DeleteGroupLocationLocalCommand } from './delete-group-location-local.command';
import { DeleteGroupLocationLocalServiceResult } from './delete-group-location-local.service';

@Controller(routesV1.version)
export class DeleteGroupLocationLocalHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.GROUP_LOCATION_LOCAL.parent} - ${resourcesV1.GROUP_LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a GroupLocationLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'GroupLocationLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'GroupLocationLocal deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: GroupLocationLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: GroupLocationLocalCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.GROUP_LOCATION_LOCAL.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.groupLocationLocal.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') groupLocationLocalId: bigint): Promise<void> {
    const command = new DeleteGroupLocationLocalCommand({
      groupLocationLocalId,
    });
    const result: DeleteGroupLocationLocalServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof GroupLocationLocalNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof GroupLocationLocalCodeAlreadyInUseError) {
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
