import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
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
import { DeleteInfoContCommand } from './delete-info-cont.command';
import { DeleteInfoContCommandResult } from './delete-info-cont.service';

@Controller(routesV1.version)
export class DeleteInfoContHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.INFO_CONT.parent} - ${resourcesV1.INFO_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a InfoCont' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'InfoCont ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'InfoCont deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: InfoContNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.INFO_CONT.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.infoCont.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') infoContId: bigint): Promise<void> {
    const command = new DeleteInfoContCommand({ infoContId });
    const result: DeleteInfoContCommandResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof InfoContNotFoundError) {
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
