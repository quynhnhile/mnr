import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RegionNotFoundError } from '@modules/region/domain/region.error';
import { RegionResponseDto } from '@modules/region/dtos/region.response.dto';
import { RegionMapper } from '@modules/region/mappers/region.mapper';
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
  FindRegionQuery,
  FindRegionQueryResult,
} from './find-region.query-handler';

@Controller(routesV1.version)
export class FindRegionHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RegionMapper,
  ) {}

  @ApiTags(`${resourcesV1.REGION.parent} - ${resourcesV1.REGION.displayName}`)
  @ApiOperation({ summary: 'Find one Region' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Region ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RegionNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REGION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.region.getOne)
  async findRegion(@Param('id') regionId: bigint): Promise<RegionResponseDto> {
    const query = new FindRegionQuery(regionId);
    const result: FindRegionQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (region) => this.mapper.toResponse(region),
      Err: (error) => {
        if (error instanceof RegionNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
