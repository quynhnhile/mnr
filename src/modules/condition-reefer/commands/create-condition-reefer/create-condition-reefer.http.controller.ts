import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import { ConditionReeferResponseDto } from '@modules/condition-reefer/dtos/condition-reefer.response.dto';
import { ConditionReeferMapper } from '@modules/condition-reefer/mappers/condition-reefer.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateConditionReeferCommand } from './create-condition-reefer.command';
import { CreateConditionReeferRequestDto } from './create-condition-reefer.request.dto';
import { CreateConditionReeferServiceResult } from './create-condition-reefer.service';
import { ConditionReeferCodeAlreadyExistsError } from '../../domain/condition-reefer.error';

@Controller(routesV1.version)
export class CreateConditionReeferHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ConditionReeferMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION_REEFER.parent} - ${resourcesV1.CONDITION_REEFER.displayName}`,
  )
  @ApiOperation({ summary: 'Create a ConditionReefer' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ConditionReeferResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ConditionReeferCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION_REEFER.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.conditionReefer.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateConditionReeferRequestDto,
  ): Promise<ConditionReeferResponseDto> {
    const command = new CreateConditionReeferCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateConditionReeferServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (conditionReefer: ConditionReeferEntity) =>
        this.mapper.toResponse(conditionReefer),
      Err: (error: Error) => {
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
