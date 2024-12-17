import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  TariffGroupCodeAlreadyInUseError,
  TariffGroupNotFoundError,
} from '@modules/tariff-group/domain/tariff-group.error';
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
import { DeleteTariffGroupCommand } from './delete-tariff-group.command';
import { DeleteTariffGroupServiceResult } from './delete-tariff-group.service';

@Controller(routesV1.version)
export class DeleteTariffGroupHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.TARIFF_GROUP.parent} - ${resourcesV1.TARIFF_GROUP.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a TariffGroup' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'TariffGroup ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'TariffGroup deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TariffGroupNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: TariffGroupCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF_GROUP.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.tariffGroup.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') tariffGroupId: bigint): Promise<void> {
    const command = new DeleteTariffGroupCommand({ tariffGroupId });
    const result: DeleteTariffGroupServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof TariffGroupNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof TariffGroupCodeAlreadyInUseError) {
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
