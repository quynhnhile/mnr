import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import {
  StatusTypeCodeAlreadyExsitError,
  StatusTypeCodeAlreadyInUseError,
  StatusTypeNotFoundError,
} from '@modules/status-type/domain/status-type.error';
import { StatusTypeResponseDto } from '@modules/status-type/dtos/status-type.response.dto';
import { StatusTypeMapper } from '@modules/status-type/mappers/status-type.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  ConflictException as ConflictHttpException,
  NotFoundException as NotFoundHttpException,
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
import { UpdateStatusTypeCommand } from './update-status-type.command';
import { UpdateStatusTypeRequestDto } from './update-status-type.request.dto';
import { UpdateStatusTypeServiceResult } from './update-status-type.service';

@Controller(routesV1.version)
export class UpdateStatusTypeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: StatusTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.STATUS_TYPE.parent} - ${resourcesV1.STATUS_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Update a StatusType' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'StatusType ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: StatusTypeCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: StatusTypeCodeAlreadyExsitError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.STATUS_TYPE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.statusType.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') statusTypeId: bigint,
    @Body() body: UpdateStatusTypeRequestDto,
  ): Promise<StatusTypeResponseDto> {
    const command = new UpdateStatusTypeCommand({
      statusTypeId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateStatusTypeServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (statusType: StatusTypeEntity) => this.mapper.toResponse(statusType),
      Err: (error: Error) => {
        if (error instanceof StatusTypeNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof StatusTypeCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof StatusTypeCodeAlreadyExsitError) {
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
