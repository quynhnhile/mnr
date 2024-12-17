import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationLocalNotFoundError } from '@modules/location-local/domain/location-local.error';
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
import { DeleteLocationLocalCommand } from './delete-location-local.command';
import { DeleteLocationLocalServiceResult } from './delete-location-local.service';

@Controller(routesV1.version)
export class DeleteLocationLocalHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.LOCATION_LOCAL.parent} - ${resourcesV1.LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a LocationLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'LocationLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'LocationLocal deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocationLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCATION_LOCAL.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.locationLocal.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') locationLocalId: bigint): Promise<void> {
    const command = new DeleteLocationLocalCommand({ locationLocalId });
    const result: DeleteLocationLocalServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof LocationLocalNotFoundError) {
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
