import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  DamageCodeAlreadyInUseError,
  DamageNotFoundError,
} from '@modules/damage/domain/damage.error';
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
import { DeleteDamageCommand } from './delete-damage.command';
import { DeleteDamageServiceResult } from './delete-damage.service';

@Controller(routesV1.version)
export class DeleteDamageHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.DAMAGE.parent} - ${resourcesV1.DAMAGE.displayName}`)
  @ApiOperation({ summary: 'Delete a Damage' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Damage ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Damage deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: DamageNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: DamageCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.damage.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') damageId: bigint): Promise<void> {
    const command = new DeleteDamageCommand({ damageId });
    const result: DeleteDamageServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof DamageNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof DamageCodeAlreadyInUseError) {
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
