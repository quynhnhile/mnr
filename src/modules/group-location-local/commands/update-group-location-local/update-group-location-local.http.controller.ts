import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { GroupLocationLocalEntity } from '@modules/group-location-local/domain/group-location-local.entity';
import {
  GroupLocationLocalCodeAlreadyExistError,
  GroupLocationLocalCodeAlreadyInUseError,
  GroupLocationLocalNotFoundError,
} from '@modules/group-location-local/domain/group-location-local.error';
import { GroupLocationLocalResponseDto } from '@modules/group-location-local/dtos/group-location-local.response.dto';
import { GroupLocationLocalMapper } from '@modules/group-location-local/mappers/group-location-local.mapper';
import {
  BadRequestException,
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
import { UpdateGroupLocationLocalCommand } from './update-group-location-local.command';
import { UpdateGroupLocationLocalRequestDto } from './update-group-location-local.request.dto';
import { UpdateGroupLocationLocalServiceResult } from './update-group-location-local.service';

@Controller(routesV1.version)
export class UpdateGroupLocationLocalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: GroupLocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.GROUP_LOCATION_LOCAL.parent} - ${resourcesV1.GROUP_LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Update a GroupLocationLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'GroupLocationLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GroupLocationLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: GroupLocationLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: GroupLocationLocalCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: GroupLocationLocalCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.GROUP_LOCATION_LOCAL.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.groupLocationLocal.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') groupLocationLocalId: bigint,
    @Body() body: UpdateGroupLocationLocalRequestDto,
  ): Promise<GroupLocationLocalResponseDto> {
    const command = new UpdateGroupLocationLocalCommand({
      groupLocationLocalId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateGroupLocationLocalServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (groupLocationLocal: GroupLocationLocalEntity) =>
        this.mapper.toResponse(groupLocationLocal),
      Err: (error: Error) => {
        if (error instanceof GroupLocationLocalNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof GroupLocationLocalCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof GroupLocationLocalCodeAlreadyExistError) {
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
