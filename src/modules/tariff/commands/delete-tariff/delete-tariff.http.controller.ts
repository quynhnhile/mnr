import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TariffNotFoundError } from '@modules/tariff/domain/tariff.error';
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
import { DeleteTariffCommand } from './delete-tariff.command';
import { DeleteTariffServiceResult } from './delete-tariff.service';

@Controller(routesV1.version)
export class DeleteTariffHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.TARIFF.parent} - ${resourcesV1.TARIFF.displayName}`)
  @ApiOperation({ summary: 'Delete a Tariff' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Tariff ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Tariff deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TariffNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.tariff.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') tariffId: bigint): Promise<void> {
    const command = new DeleteTariffCommand({ tariffId });
    const result: DeleteTariffServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof TariffNotFoundError) {
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
