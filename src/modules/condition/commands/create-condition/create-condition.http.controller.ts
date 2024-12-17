import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import { ConditionResponseDto } from '@modules/condition/dtos/condition.response.dto';
import { ConditionMapper } from '@modules/condition/mappers/condition.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateConditionCommand } from './create-condition.command';
import { CreateConditionRequestDto } from './create-condition.request.dto';
import { CreateConditionServiceResult } from './create-condition.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';
import { ConditionCodeAlreadyExistsError } from '../../domain/condition.error';

@Controller(routesV1.version)
export class CreateConditionHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ConditionMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION.parent} - ${resourcesV1.CONDITION.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Condition' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ConditionCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.condition.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateConditionRequestDto,
  ): Promise<ConditionResponseDto> {
    const command = new CreateConditionCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateConditionServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (condition: ConditionEntity) => this.mapper.toResponse(condition),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
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
