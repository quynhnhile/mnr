import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import {
  ConditionReeferCodeAlreadyExistsError,
  ConditionReeferNotFoundError,
} from '@modules/condition-reefer/domain/condition-reefer.error';
import { ConditionReeferResponseDto } from '@modules/condition-reefer/dtos/condition-reefer.response.dto';
import { ConditionReeferMapper } from '@modules/condition-reefer/mappers/condition-reefer.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateConditionReeferCommand } from './update-condition-reefer.command';
import { UpdateConditionReeferRequestDto } from './update-condition-reefer.request.dto';
import { UpdateConditionReeferServiceResult } from './update-condition-reefer.service';

@Controller(routesV1.version)
export class UpdateConditionReeferHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ConditionReeferMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION_REEFER.parent} - ${resourcesV1.CONDITION_REEFER.displayName}`,
  )
  @ApiOperation({ summary: 'Update a ConditionReefer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ConditionReefer ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConditionReeferResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ConditionReeferNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ConditionReeferCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION_REEFER.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.conditionReefer.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') conditionReeferId: bigint,
    @Body() body: UpdateConditionReeferRequestDto,
  ): Promise<ConditionReeferResponseDto> {
    const command = new UpdateConditionReeferCommand({
      conditionReeferId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateConditionReeferServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (conditionReefer: ConditionReeferEntity) =>
        this.mapper.toResponse(conditionReefer),
      Err: (error: Error) => {
        if (error instanceof ConditionReeferNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof ConditionReeferCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
