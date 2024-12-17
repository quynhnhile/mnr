import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionReeferNotFoundError } from '@modules/condition-reefer/domain/condition-reefer.error';
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
import { DeleteConditionReeferCommand } from './delete-condition-reefer.command';
import { DeleteConditionReeferServiceResult } from './delete-condition-reefer.service';

@Controller(routesV1.version)
export class DeleteConditionReeferHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CONDITION_REEFER.parent} - ${resourcesV1.CONDITION_REEFER.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a ConditionReefer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ConditionReefer ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'ConditionReefer deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ConditionReeferNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION_REEFER.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.conditionReefer.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') conditionReeferId: bigint): Promise<void> {
    const command = new DeleteConditionReeferCommand({ conditionReeferId });
    const result: DeleteConditionReeferServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ConditionReeferNotFoundError) {
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
