import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';
import { VendorResponseDto } from '@modules/vendor/dtos/vendor.response.dto';
import { VendorMapper } from '@modules/vendor/mappers/vendor.mapper';
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
  FindVendorQuery,
  FindVendorQueryResult,
} from './find-vendor.query-handler';

@Controller(routesV1.version)
export class FindVendorHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: VendorMapper,
  ) {}

  @ApiTags(`${resourcesV1.VENDOR.parent} - ${resourcesV1.VENDOR.displayName}`)
  @ApiOperation({ summary: 'Find one Vendor' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Vendor ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VendorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: VendorNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.vendor.getOne)
  async findVendor(@Param('id') vendorId: bigint): Promise<VendorResponseDto> {
    const query = new FindVendorQuery(vendorId);
    const result: FindVendorQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (vendor) => this.mapper.toResponse(vendor),
      Err: (error) => {
        if (error instanceof VendorNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
