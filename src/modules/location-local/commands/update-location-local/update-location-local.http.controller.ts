import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import {
  LocationLocalCodeAlreadyExistsError,
  LocationLocalNotFoundError,
} from '@modules/location-local/domain/location-local.error';
import { LocationLocalResponseDto } from '@modules/location-local/dtos/location-local.response.dto';
import { LocationLocalMapper } from '@modules/location-local/mappers/location-local.mapper';
import {
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
import { UpdateLocationLocalCommand } from './update-location-local.command';
import { UpdateLocationLocalRequestDto } from './update-location-local.request.dto';
import { UpdateLocationLocalServiceResult } from './update-location-local.service';

@Controller(routesV1.version)
export class UpdateLocationLocalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: LocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION_LOCAL.parent} - ${resourcesV1.LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Update a LocationLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'LocationLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocationLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocationLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: LocationLocalCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCATION_LOCAL.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.locationLocal.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') locationLocalId: bigint,
    @Body() body: UpdateLocationLocalRequestDto,
  ): Promise<LocationLocalResponseDto> {
    const command = new UpdateLocationLocalCommand({
      locationLocalId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateLocationLocalServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (locationLocal: LocationLocalEntity) =>
        this.mapper.toResponse(locationLocal),
      Err: (error: Error) => {
        if (error instanceof LocationLocalNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof LocationLocalCodeAlreadyExistsError) {
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
