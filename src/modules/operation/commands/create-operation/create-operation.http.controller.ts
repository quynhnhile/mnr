import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { OperationEntity } from '@modules/operation/domain/operation.entity';
import { OperationCodeAlreadyExistsError } from '@modules/operation/domain/operation.error';
import { OperationResponseDto } from '@modules/operation/dtos/operation.response.dto';
import { OperationMapper } from '@modules/operation/mappers/operation.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOperationCommand } from './create-operation.command';
import { CreateOperationRequestDto } from './create-operation.request.dto';
import { CreateOperationServiceResult } from './create-operation.service';

@Controller(routesV1.version)
export class CreateOperationHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: OperationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.OPERATION.parent} - ${resourcesV1.OPERATION.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Operation' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OperationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: OperationCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.OPERATION.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.operation.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateOperationRequestDto,
  ): Promise<OperationResponseDto> {
    const command = new CreateOperationCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateOperationServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (operation: OperationEntity) => this.mapper.toResponse(operation),
      Err: (error: Error) => {
        if (error instanceof OperationCodeAlreadyExistsError) {
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
