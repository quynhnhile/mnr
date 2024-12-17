import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TariffGroupScalarFieldEnum } from '@modules/tariff-group/database/tariff-group.repository.prisma';
import { TariffGroupPaginatedResponseDto } from '@modules/tariff-group/dtos/tariff-group.paginated.response.dto';
import { TariffGroupMapper } from '@modules/tariff-group/mappers/tariff-group.mapper';
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
  FindTariffGroupsQuery,
  FindTariffGroupsQueryResult,
} from './find-tariff-groups.query-handler';
import { FindTariffGroupsRequestDto } from './find-tariff-groups.request.dto';

@Controller(routesV1.version)
export class FindTariffGroupsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TariffGroupMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TARIFF_GROUP.parent} - ${resourcesV1.TARIFF_GROUP.displayName}`,
  )
  @ApiOperation({ summary: 'Find TariffGroups' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindTariffGroupsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindTariffGroupsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TariffGroupPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.TARIFF_GROUP.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.tariffGroup.root)
  async findTariffGroups(
    @Query(
      new DirectFilterPipe<any, Prisma.TariffGroupWhereInput>([
        TariffGroupScalarFieldEnum.id,
        TariffGroupScalarFieldEnum.groupTrfCode,
        TariffGroupScalarFieldEnum.groupTrfName,
        TariffGroupScalarFieldEnum.laborRate,
        TariffGroupScalarFieldEnum.isDry,
        TariffGroupScalarFieldEnum.isReefer,
        TariffGroupScalarFieldEnum.isTank,
        TariffGroupScalarFieldEnum.operationCode,
        TariffGroupScalarFieldEnum.vendorCode,
        TariffGroupScalarFieldEnum.isTerminal,
      ]),
    )
    queryParams: FindTariffGroupsRequestDto,
  ): Promise<TariffGroupPaginatedResponseDto> {
    const query = new FindTariffGroupsQuery(queryParams.findOptions);
    const result: FindTariffGroupsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new TariffGroupPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
