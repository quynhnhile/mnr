import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocationLocalPaginatedResponseDto } from '@modules/location-local/dtos/location-local.paginated.response.dto';
import { LocationLocalMapper } from '@modules/location-local/mappers/location-local.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindLocationLocalsQuery,
  FindLocationLocalsQueryResult,
} from './find-location-locals.query-handler';
import { FindLocationLocalsRequestDto } from './find-location-locals.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { LocationLocalScalarFieldEnum } from '../../database/location-local.repository.prisma';

@Controller(routesV1.version)
export class FindLocationLocalsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: LocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCATION_LOCAL.parent} - ${resourcesV1.LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find LocationLocals' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocationLocalPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.LOCATION_LOCAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.locationLocal.root)
  async findLocationLocals(
    @Query(
      new DirectFilterPipe<any, Prisma.LocationLocalWhereInput>([
        LocationLocalScalarFieldEnum.id,
        LocationLocalScalarFieldEnum.groupLocLocalCode,
        LocationLocalScalarFieldEnum.locLocalCode,
        LocationLocalScalarFieldEnum.locLocalNameEn,
        LocationLocalScalarFieldEnum.locLocalNameVi,
      ]),
    )
    queryParams: FindLocationLocalsRequestDto,
  ): Promise<LocationLocalPaginatedResponseDto> {
    const query = new FindLocationLocalsQuery(queryParams.findOptions);
    const result: FindLocationLocalsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new LocationLocalPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
