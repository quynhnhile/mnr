import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { VendorTypeScalarFieldEnum } from '@modules/vendor-type/database/vendor-type.repository.prisma';
import { VendorTypePaginatedResponseDto } from '@modules/vendor-type/dtos/vendor-type.paginated.response.dto';
import { VendorTypeMapper } from '@modules/vendor-type/mappers/vendor-type.mapper';
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
  FindVendorTypesQuery,
  FindVendorTypesQueryResult,
} from './find-vendor-types.query-handler';
import { FindVendorTypesRequestDto } from './find-vendor-types.request.dto';

@Controller(routesV1.version)
export class FindVendorTypesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: VendorTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.VENDOR_TYPE.parent} - ${resourcesV1.VENDOR_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Find VendorTypes' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindVendorTypesRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindVendorTypesRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VendorTypePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.VENDOR_TYPE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.vendorType.root)
  async findVendorTypes(
    @Query(
      new DirectFilterPipe<any, Prisma.VendorTypeWhereInput>([
        VendorTypeScalarFieldEnum.id,
        VendorTypeScalarFieldEnum.vendorTypeCode,
        VendorTypeScalarFieldEnum.vendorTypeName,
      ]),
    )
    queryParams: FindVendorTypesRequestDto,
  ): Promise<VendorTypePaginatedResponseDto> {
    const query = new FindVendorTypesQuery(queryParams.findOptions);
    const result: FindVendorTypesQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new VendorTypePaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
