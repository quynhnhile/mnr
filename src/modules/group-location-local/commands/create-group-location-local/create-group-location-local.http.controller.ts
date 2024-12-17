import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { GroupLocationLocalEntity } from '@modules/group-location-local/domain/group-location-local.entity';
import { GroupLocationLocalResponseDto } from '@modules/group-location-local/dtos/group-location-local.response.dto';
import { GroupLocationLocalMapper } from '@modules/group-location-local/mappers/group-location-local.mapper';
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
import { CreateGroupLocationLocalCommand } from './create-group-location-local.command';
import { CreateGroupLocationLocalRequestDto } from './create-group-location-local.request.dto';
import { CreateGroupLocationLocalServiceResult } from './create-group-location-local.service';
import { GroupLocationLocalCodeAlreadyExistError } from '../../domain/group-location-local.error';

@Controller(routesV1.version)
export class CreateGroupLocationLocalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: GroupLocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.GROUP_LOCATION_LOCAL.parent} - ${resourcesV1.GROUP_LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Create a GroupLocationLocal' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GroupLocationLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: GroupLocationLocalCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.GROUP_LOCATION_LOCAL.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.groupLocationLocal.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateGroupLocationLocalRequestDto,
  ): Promise<GroupLocationLocalResponseDto> {
    const command = new CreateGroupLocationLocalCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateGroupLocationLocalServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (groupLocationLocal: GroupLocationLocalEntity) =>
        this.mapper.toResponse(groupLocationLocal),
      Err: (error: Error) => {
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
