import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import { LocationLocalResponseDto } from '@modules/location-local/dtos/location-local.response.dto';
import { LocationLocalMapper } from '@modules/location-local/mappers/location-local.mapper';
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
import { CreateLocationLocalCommand } from './create-location-local.command';
import { CreateLocationLocalRequestDto } from './create-location-local.request.dto';
import { CreateLocationLocalServiceResult } from './create-location-local.service';
import { LocationLocalCodeAlreadyExistsError } from '../../domain/location-local.error';

@Controller(routesV1.version)
export class CreateLocationLocalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: LocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION_LOCAL.parent} - ${resourcesV1.LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Create a LocationLocal' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: LocationLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: LocationLocalCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCATION_LOCAL.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.locationLocal.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateLocationLocalRequestDto,
  ): Promise<LocationLocalResponseDto> {
    const command = new CreateLocationLocalCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateLocationLocalServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (locationLocal: LocationLocalEntity) =>
        this.mapper.toResponse(locationLocal),
      Err: (error: Error) => {
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
