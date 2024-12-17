import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RegionNotFoundError } from '@modules/region/domain/region.error';
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
import { DeleteRegionCommand } from './delete-region.command';
import { DeleteRegionServiceResult } from './delete-region.service';

@Controller(routesV1.version)
export class DeleteRegionHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.REGION.parent} - ${resourcesV1.REGION.displayName}`)
  @ApiOperation({ summary: 'Delete a Region' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Region ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Region deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RegionNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REGION.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.region.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') regionId: bigint): Promise<void> {
    const command = new DeleteRegionCommand({ regionId });
    const result: DeleteRegionServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof RegionNotFoundError) {
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
