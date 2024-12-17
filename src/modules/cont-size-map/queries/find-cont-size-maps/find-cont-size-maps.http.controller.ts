import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContSizeMapScalarFieldEnum } from '@modules/cont-size-map/database/cont-size-map.repository.prisma';
import { ContSizeMapPaginatedResponseDto } from '@modules/cont-size-map/dtos/cont-size-map.paginated.response.dto';
import { ContSizeMapMapper } from '@modules/cont-size-map/mappers/cont-size-map.mapper';
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
  FindContSizeMapsQuery,
  FindContSizeMapsQueryResult,
} from './find-cont-size-maps.query-handler';
import { FindContSizeMapsRequestDto } from './find-cont-size-maps.request.dto';

@Controller(routesV1.version)
export class FindContSizeMapsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ContSizeMapMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONT_SIZE_MAP.parent} - ${resourcesV1.CONT_SIZE_MAP.displayName}`,
  )
  @ApiOperation({ summary: 'Find ContSizeMaps' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindContSizeMapsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindContSizeMapsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ContSizeMapPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CONT_SIZE_MAP.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.contSizeMap.root)
  async findContSizeMaps(
    @Query(
      new DirectFilterPipe<any, Prisma.ContSizeMapWhereInput>([
        ContSizeMapScalarFieldEnum.id,
        ContSizeMapScalarFieldEnum.operationCode,
        ContSizeMapScalarFieldEnum.localSizeType,
        ContSizeMapScalarFieldEnum.isoSizeType,
        ContSizeMapScalarFieldEnum.size,
        ContSizeMapScalarFieldEnum.contType,
        ContSizeMapScalarFieldEnum.contTypeName,
      ]),
    )
    queryParams: FindContSizeMapsRequestDto,
  ): Promise<ContSizeMapPaginatedResponseDto> {
    const query = new FindContSizeMapsQuery(queryParams.findOptions);
    const result: FindContSizeMapsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ContSizeMapPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
