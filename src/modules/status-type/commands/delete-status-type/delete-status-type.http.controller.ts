import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  StatusTypeCodeAlreadyInUseError,
  StatusTypeNotFoundError,
} from '@modules/status-type/domain/status-type.error';
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
import { DeleteStatusTypeCommand } from './delete-status-type.command';
import { DeleteStatusTypeServiceResult } from './delete-status-type.service';

@Controller(routesV1.version)
export class DeleteStatusTypeHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.STATUS_TYPE.parent} - ${resourcesV1.STATUS_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a StatusType' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'StatusType ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'StatusType deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: StatusTypeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: StatusTypeCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.STATUS_TYPE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.statusType.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') statusTypeId: bigint): Promise<void> {
    const command = new DeleteStatusTypeCommand({ statusTypeId });
    const result: DeleteStatusTypeServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof StatusTypeNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof StatusTypeCodeAlreadyInUseError) {
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
