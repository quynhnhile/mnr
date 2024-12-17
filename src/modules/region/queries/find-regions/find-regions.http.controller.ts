import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RegionScalarFieldEnum } from '@modules/region/database/region.repository.prisma';
import { RegionPaginatedResponseDto } from '@modules/region/dtos/region.paginated.response.dto';
import { RegionMapper } from '@modules/region/mappers/region.mapper';
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
  FindRegionsQuery,
  FindRegionsQueryResult,
} from './find-regions.query-handler';
import { FindRegionsRequestDto } from './find-regions.request.dto';

@Controller(routesV1.version)
export class FindRegionsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RegionMapper,
  ) {}

  @ApiTags(`${resourcesV1.REGION.parent} - ${resourcesV1.REGION.displayName}`)
  @ApiOperation({ summary: 'Find Regions' })
  @ApiQuery({
    type: FilterDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FilterDto),
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegionPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.REGION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.region.root)
  async findRegions(
    @Query(
      new DirectFilterPipe<any, Prisma.RegionWhereInput>([
        RegionScalarFieldEnum.id,
        RegionScalarFieldEnum.regionCode,
        RegionScalarFieldEnum.regionName,
      ]),
    )
    queryParams: FindRegionsRequestDto,
  ): Promise<any> {
    const query = new FindRegionsQuery(queryParams.findOptions);
    const result: FindRegionsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new RegionPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
