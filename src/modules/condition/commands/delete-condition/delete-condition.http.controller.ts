import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  ConditionCodeAlreadyInUseError,
  ConditionNotFoundError,
} from '@modules/condition/domain/condition.error';
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
import { DeleteConditionCommand } from './delete-condition.command';
import { DeleteConditionServiceResult } from './delete-condition.service';

@Controller(routesV1.version)
export class DeleteConditionHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CONDITION.parent} - ${resourcesV1.CONDITION.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Condition' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Condition ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Condition deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ConditionNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ConditionCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.condition.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') conditionId: bigint): Promise<void> {
    const command = new DeleteConditionCommand({ conditionId });
    const result: DeleteConditionServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ConditionNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof ConditionCodeAlreadyInUseError) {
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
