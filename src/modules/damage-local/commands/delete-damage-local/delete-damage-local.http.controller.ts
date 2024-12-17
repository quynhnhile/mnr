import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageLocalNotFoundError } from '@modules/damage-local/domain/damage-local.error';
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
import { DeleteDamageLocalCommand } from './delete-damage-local.command';
import { DeleteDamageLocalServiceResult } from './delete-damage-local.service';

@Controller(routesV1.version)
export class DeleteDamageLocalHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.DAMAGE_LOCAL.parent} - ${resourcesV1.DAMAGE_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a DamageLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'DamageLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'DamageLocal deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: DamageLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE_LOCAL.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.damageLocal.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') damageLocalId: bigint): Promise<void> {
    const command = new DeleteDamageLocalCommand({ damageLocalId });
    const result: DeleteDamageLocalServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof DamageLocalNotFoundError) {
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
