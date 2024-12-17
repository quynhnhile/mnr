import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationEntity } from '@modules/location/domain/location.entity';
import { LocationResponseDto } from '@modules/location/dtos/location.response.dto';
import { LocationMapper } from '@modules/location/mappers/location.mapper';
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
import { CreateLocationCommand } from './create-location.command';
import { CreateLocationRequestDto } from './create-location.request.dto';
import { CreateLocationServiceResult } from './create-location.service';
import { LocationCodeAlreadyExistsError } from '../../domain/location.error';

@Controller(routesV1.version)
export class CreateLocationHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: LocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION.parent} - ${resourcesV1.LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Location' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: LocationCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCATION.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.location.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateLocationRequestDto,
  ): Promise<LocationResponseDto> {
    const command = new CreateLocationCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateLocationServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (location: LocationEntity) => this.mapper.toResponse(location),
      Err: (error: Error) => {
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
