import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocalDmgDetailNotFoundError } from '@modules/local-dmg-detail/domain/local-dmg-detail.error';
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
import { DeleteLocalDmgDetailCommand } from './delete-local-dmg-detail.command';
import { DeleteLocalDmgDetailServiceResult } from './delete-local-dmg-detail.service';

@Controller(routesV1.version)
export class DeleteLocalDmgDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.LOCAL_DMG_DETAIL.parent} - ${resourcesV1.LOCAL_DMG_DETAIL.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a LocalDmgDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'LocalDmgDetail ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'LocalDmgDetail deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocalDmgDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCAL_DMG_DETAIL.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.localDmgDetail.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') localDmgDetailId: bigint): Promise<void> {
    const command = new DeleteLocalDmgDetailCommand({ localDmgDetailId });
    const result: DeleteLocalDmgDetailServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof LocalDmgDetailNotFoundError) {
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
