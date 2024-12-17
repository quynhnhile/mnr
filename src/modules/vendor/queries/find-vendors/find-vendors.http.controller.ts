import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { VendorScalarFieldEnum } from '@modules/vendor/database/vendor.repository.prisma';
import { VendorPaginatedResponseDto } from '@modules/vendor/dtos/vendor.paginated.response.dto';
import { VendorMapper } from '@modules/vendor/mappers/vendor.mapper';
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
  FindVendorsQuery,
  FindVendorsQueryResult,
} from './find-vendors.query-handler';
import { FindVendorsRequestDto } from './find-vendors.request.dto';

@Controller(routesV1.version)
export class FindVendorsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: VendorMapper,
  ) {}

  @ApiTags(`${resourcesV1.VENDOR.parent} - ${resourcesV1.VENDOR.displayName}`)
  @ApiOperation({ summary: 'Find Vendors' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindVendorsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindVendorsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VendorPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.VENDOR.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.vendor.root)
  async findVendors(
    @Query(
      new DirectFilterPipe<any, Prisma.VendorWhereInput>([
        VendorScalarFieldEnum.id,
        VendorScalarFieldEnum.operationCode,
        VendorScalarFieldEnum.vendorTypeCode,
        VendorScalarFieldEnum.vendorCode,
        VendorScalarFieldEnum.isActive,
      ]),
    )
    queryParams: FindVendorsRequestDto,
  ): Promise<VendorPaginatedResponseDto> {
    const query = new FindVendorsQuery(queryParams.findOptions);
    const result: FindVendorsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new VendorPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
