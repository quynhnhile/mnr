import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationScalarFieldEnum } from '@modules/location/database/location.repository.prisma';
import { LocationPaginatedResponseDto } from '@modules/location/dtos/location.paginated.response.dto';
import { LocationMapper } from '@modules/location/mappers/location.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  FindLocationsQuery,
  FindLocationsQueryResult,
} from './find-locations.query-handler';
import { FindLocationsRequestDto } from './find-locations.request.dto';

@Controller(routesV1.version)
export class FindLocationsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: LocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION.parent} - ${resourcesV1.LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Find Locations' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindLocationsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindLocationsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocationPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.LOCATION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.location.root)
  async findLocations(
    @Query(
      new DirectFilterPipe<any, Prisma.LocationWhereInput>([
        LocationScalarFieldEnum.id,
        LocationScalarFieldEnum.locCode,
        LocationScalarFieldEnum.locNameEn,
        LocationScalarFieldEnum.locNameVi,
        LocationScalarFieldEnum.side,
        LocationScalarFieldEnum.size,
      ]),
    )
    queryParams: FindLocationsRequestDto,
  ): Promise<LocationPaginatedResponseDto> {
    const query = new FindLocationsQuery(queryParams.findOptions);
    const result: FindLocationsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new LocationPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
