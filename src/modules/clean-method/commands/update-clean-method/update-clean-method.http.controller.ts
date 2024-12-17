import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanMethodEntity } from '@modules/clean-method/domain/clean-method.entity';
import {
  CleanMethodCodeAlreadyInUseError,
  CleanMethodCodeAndOperationCodeAlreadyExistError,
  CleanMethodNotFoundError,
} from '@modules/clean-method/domain/clean-method.error';
import { CleanMethodResponseDto } from '@modules/clean-method/dtos/clean-method.response.dto';
import { CleanMethodMapper } from '@modules/clean-method/mappers/clean-method.mapper';
import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
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
import { UpdateCleanMethodCommand } from './update-clean-method.command';
import { UpdateCleanMethodRequestDto } from './update-clean-method.request.dto';
import { UpdateCleanMethodServiceResult } from './update-clean-method.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

@Controller(routesV1.version)
export class UpdateCleanMethodHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CleanMethodMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_METHOD.parent} - ${resourcesV1.CLEAN_METHOD.displayName}`,
  )
  @ApiOperation({ summary: 'Update a CleanMethod' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'CleanMethod ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CleanMethodResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${CleanMethodNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CleanMethodCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CleanMethodCodeAndOperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_METHOD.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.cleanMethod.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') cleanMethodId: bigint,
    @Body() body: UpdateCleanMethodRequestDto,
  ): Promise<CleanMethodResponseDto> {
    const command = new UpdateCleanMethodCommand({
      cleanMethodId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateCleanMethodServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (cleanMethod: CleanMethodEntity) =>
        this.mapper.toResponse(cleanMethod),
      Err: (error: Error) => {
        if (error instanceof CleanMethodNotFoundError) {
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

        if (error instanceof CleanMethodCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof CleanMethodCodeAndOperationCodeAlreadyExistError) {
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
