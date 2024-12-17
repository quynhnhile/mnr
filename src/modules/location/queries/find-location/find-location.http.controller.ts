import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationNotFoundError } from '@modules/location/domain/location.error';
import { LocationResponseDto } from '@modules/location/dtos/location.response.dto';
import { LocationMapper } from '@modules/location/mappers/location.mapper';
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
  FindLocationQuery,
  FindLocationQueryResult,
} from './find-location.query-handler';

@Controller(routesV1.version)
export class FindLocationHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: LocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION.parent} - ${resourcesV1.LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Location' })
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
  @AuthPermission(resourcesV1.LOCATION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.location.getOne)
  async findLocation(
    @Param('id') locationId: bigint,
  ): Promise<LocationResponseDto> {
    const query = new FindLocationQuery(locationId);
    const result: FindLocationQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (location) => this.mapper.toResponse(location),
      Err: (error) => {
        if (error instanceof LocationNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
