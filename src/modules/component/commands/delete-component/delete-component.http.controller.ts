import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  ComponentCodeAlreadyInUseError,
  ComponentNotFoundError,
} from '@modules/component/domain/component.error';
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
import { DeleteComponentCommand } from './delete-component.command';
import { DeleteComponentServiceResult } from './delete-component.service';

@Controller(routesV1.version)
export class DeleteComponentHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.COMPONENT.parent} - ${resourcesV1.COMPONENT.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Component' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Component ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Component deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ComponentNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ComponentCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COMPONENT.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.component.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') componentId: bigint): Promise<void> {
    const command = new DeleteComponentCommand({ componentId });
    const result: DeleteComponentServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ComponentNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ComponentCodeAlreadyInUseError) {
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
