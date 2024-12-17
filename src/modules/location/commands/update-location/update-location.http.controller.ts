import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationEntity } from '@modules/location/domain/location.entity';
import {
  LocationCodeAlreadyExistsError,
  LocationCodeAlreadyInUseError,
  LocationNotFoundError,
} from '@modules/location/domain/location.error';
import { LocationResponseDto } from '@modules/location/dtos/location.response.dto';
import { LocationMapper } from '@modules/location/mappers/location.mapper';
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
import { UpdateLocationCommand } from './update-location.command';
import { UpdateLocationRequestDto } from './update-location.request.dto';
import { UpdateLocationServiceResult } from './update-location.service';

@Controller(routesV1.version)
export class UpdateLocationHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: LocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION.parent} - ${resourcesV1.LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Location' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Location ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: LocationCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: LocationCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCATION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.location.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') locationId: bigint,
    @Body() body: UpdateLocationRequestDto,
  ): Promise<LocationResponseDto> {
    const command = new UpdateLocationCommand({
      locationId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateLocationServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (location: LocationEntity) => this.mapper.toResponse(location),
      Err: (error: Error) => {
        if (error instanceof LocationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof LocationCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof LocationCodeAlreadyExistsError) {
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
