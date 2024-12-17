import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanModeEntity } from '@modules/clean-mode/domain/clean-mode.entity';
import {
  CleanModeCodeAlreadyInUseError,
  CleanModeCodeAndOperationCodeAlreadyExistError,
  CleanModeNotFoundError,
} from '@modules/clean-mode/domain/clean-mode.error';
import { CleanModeResponseDto } from '@modules/clean-mode/dtos/clean-mode.response.dto';
import { CleanModeMapper } from '@modules/clean-mode/mappers/clean-mode.mapper';
import {
  Body,
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
import { UpdateCleanModeCommand } from './update-clean-mode.command';
import { UpdateCleanModeRequestDto } from './update-clean-mode.request.dto';
import { UpdateCleanModeServiceResult } from './update-clean-mode.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

@Controller(routesV1.version)
export class UpdateCleanModeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CleanModeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_MODE.parent} - ${resourcesV1.CLEAN_MODE.displayName}`,
  )
  @ApiOperation({ summary: 'Update a CleanMode' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'CleanMode ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CleanModeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${CleanModeNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CleanModeCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CleanModeCodeAndOperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_MODE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.cleanMode.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') cleanModeId: bigint,
    @Body() body: UpdateCleanModeRequestDto,
  ): Promise<CleanModeResponseDto> {
    const command = new UpdateCleanModeCommand({
      cleanModeId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateCleanModeServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (cleanMode: CleanModeEntity) => this.mapper.toResponse(cleanMode),
      Err: (error: Error) => {
        if (error instanceof CleanModeNotFoundError) {
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
        if (error instanceof CleanModeCodeAlreadyInUseError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof CleanModeCodeAndOperationCodeAlreadyExistError) {
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
