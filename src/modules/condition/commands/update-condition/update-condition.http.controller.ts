import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import {
  ConditionCodeAlreadyExistsError,
  ConditionCodeAlreadyInUseError,
  ConditionNotFoundError,
} from '@modules/condition/domain/condition.error';
import { ConditionResponseDto } from '@modules/condition/dtos/condition.response.dto';
import { ConditionMapper } from '@modules/condition/mappers/condition.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
  Param,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateConditionCommand } from './update-condition.command';
import { UpdateConditionRequestDto } from './update-condition.request.dto';
import { UpdateConditionServiceResult } from './update-condition.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

@Controller(routesV1.version)
export class UpdateConditionHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ConditionMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION.parent} - ${resourcesV1.CONDITION.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Condition' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Condition ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${ConditionNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ConditionCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ConditionCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.condition.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') conditionId: bigint,
    @Body() body: UpdateConditionRequestDto,
  ): Promise<ConditionResponseDto> {
    const command = new UpdateConditionCommand({
      conditionId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateConditionServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (condition: ConditionEntity) => this.mapper.toResponse(condition),
      Err: (error: Error) => {
        if (error instanceof ConditionNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof OperationNotFoundError) {
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

        if (error instanceof ConditionCodeAlreadyExistsError) {
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
