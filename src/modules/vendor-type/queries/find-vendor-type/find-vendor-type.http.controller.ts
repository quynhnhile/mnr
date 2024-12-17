import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { VendorTypeNotFoundError } from '@modules/vendor-type/domain/vendor-type.error';
import { VendorTypeResponseDto } from '@modules/vendor-type/dtos/vendor-type.response.dto';
import { VendorTypeMapper } from '@modules/vendor-type/mappers/vendor-type.mapper';
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
  FindVendorTypeQuery,
  FindVendorTypeQueryResult,
} from './find-vendor-type.query-handler';

@Controller(routesV1.version)
export class FindVendorTypeHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: VendorTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.VENDOR_TYPE.parent} - ${resourcesV1.VENDOR_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one VendorType' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'VendorType ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VendorTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: VendorTypeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR_TYPE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.vendorType.getOne)
  async findVendorType(
    @Param('id') vendorTypeId: bigint,
  ): Promise<VendorTypeResponseDto> {
    const query = new FindVendorTypeQuery(vendorTypeId);
    const result: FindVendorTypeQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (vendorType) => this.mapper.toResponse(vendorType),
      Err: (error) => {
        if (error instanceof VendorTypeNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
