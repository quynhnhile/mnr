import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  LocationCodeAlreadyInUseError,
  LocationNotFoundError,
} from '@modules/location/domain/location.error';
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
import { DeleteLocationCommand } from './delete-location.command';
import { DeleteLocationServiceResult } from './delete-location.service';

@Controller(routesV1.version)
export class DeleteLocationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.LOCATION.parent} - ${resourcesV1.LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Location' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Location ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Location deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: LocationCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCATION.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.location.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') locationId: bigint): Promise<void> {
    const command = new DeleteLocationCommand({ locationId });
    const result: DeleteLocationServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof LocationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof LocationCodeAlreadyInUseError) {
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
