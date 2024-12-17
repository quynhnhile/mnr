import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationLocalNotFoundError } from '@modules/location-local/domain/location-local.error';
import { LocationLocalResponseDto } from '@modules/location-local/dtos/location-local.response.dto';
import { LocationLocalMapper } from '@modules/location-local/mappers/location-local.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindLocationLocalQuery,
  FindLocationLocalQueryResult,
} from './find-location-local.query-handler';

@Controller(routesV1.version)
export class FindLocationLocalHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: LocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION_LOCAL.parent} - ${resourcesV1.LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find one LocationLocal' })
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
  @AuthPermission(resourcesV1.LOCATION_LOCAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.locationLocal.getOne)
  async findLocationLocal(
    @Param('id') locationLocalId: bigint,
  ): Promise<LocationLocalResponseDto> {
    const query = new FindLocationLocalQuery(locationLocalId);
    const result: FindLocationLocalQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (locationLocal) => this.mapper.toResponse(locationLocal),
      Err: (error) => {
        if (error instanceof LocationLocalNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
