import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { OperationEntity } from '@modules/operation/domain/operation.entity';
import {
  OperationCodeAlreadyExistsError,
  OperationCodeAlreadyInUseError,
  OperationNotFoundError,
} from '@modules/operation/domain/operation.error';
import { OperationResponseDto } from '@modules/operation/dtos/operation.response.dto';
import { OperationMapper } from '@modules/operation/mappers/operation.mapper';
import {
  BadRequestException,
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
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
import { UpdateOperationCommand } from './update-operation.command';
import { UpdateOperationRequestDto } from './update-operation.request.dto';
import { UpdateOperationServiceResult } from './update-operation.service';

@Controller(routesV1.version)
export class UpdateOperationHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: OperationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.OPERATION.parent} - ${resourcesV1.OPERATION.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Operation' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Operation ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OperationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: OperationCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: OperationCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.OPERATION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.operation.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') operationId: bigint,
    @Body() body: UpdateOperationRequestDto,
  ): Promise<OperationResponseDto> {
    const command = new UpdateOperationCommand({
      operationId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateOperationServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (operation: OperationEntity) => this.mapper.toResponse(operation),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof OperationCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
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
