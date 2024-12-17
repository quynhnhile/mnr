import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TariffScalarFieldEnum } from '@modules/tariff/database/tariff.repository.prisma';
import { TariffPaginatedResponseDto } from '@modules/tariff/dtos/tariff.paginated.response.dto';
import { TariffMapper } from '@modules/tariff/mappers/tariff.mapper';
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
  FindTariffsQuery,
  FindTariffsQueryResult,
} from './find-tariffs.query-handler';
import { FindTariffsRequestDto } from './find-tariffs.request.dto';

@Controller(routesV1.version)
export class FindTariffsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TariffMapper,
  ) {}

  @ApiTags(`${resourcesV1.TARIFF.parent} - ${resourcesV1.TARIFF.displayName}`)
  @ApiOperation({ summary: 'Find Tariffs' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindTariffsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindTariffsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TariffPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.TARIFF.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.tariff.root)
  async findTariffs(
    @Query(
      new DirectFilterPipe<any, Prisma.TariffWhereInput>([
        TariffScalarFieldEnum.id,
        TariffScalarFieldEnum.groupTrfCode,
        TariffScalarFieldEnum.compCode,
        TariffScalarFieldEnum.locCode,
        TariffScalarFieldEnum.damCode,
        TariffScalarFieldEnum.repCode,
        TariffScalarFieldEnum.length,
        TariffScalarFieldEnum.width,
        TariffScalarFieldEnum.unit,
        TariffScalarFieldEnum.quantity,
        TariffScalarFieldEnum.hours,
        TariffScalarFieldEnum.currency,
        TariffScalarFieldEnum.mateAmount,
        TariffScalarFieldEnum.vat,
        TariffScalarFieldEnum.includeVat,
        TariffScalarFieldEnum.add,
        TariffScalarFieldEnum.addHours,
        TariffScalarFieldEnum.addMate,
      ]),
    )
    queryParams: FindTariffsRequestDto,
  ): Promise<TariffPaginatedResponseDto> {
    const query = new FindTariffsQuery(queryParams.findOptions);
    const result: FindTariffsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new TariffPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
