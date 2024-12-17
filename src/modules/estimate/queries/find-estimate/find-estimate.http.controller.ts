import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
import { EstimateResponseDto } from '@modules/estimate/dtos/estimate.response.dto';
import { EstimateMapper } from '@modules/estimate/mappers/estimate.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  ParseBoolPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindEstimateQuery,
  FindEstimateQueryResult,
} from './find-estimate.query-handler';

@Controller(routesV1.version)
export class FindEstimateHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: EstimateMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Estimate' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Estimate ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiQuery({
    name: 'includeStatistics',
    type: 'boolean',
    example: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EstimateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.estimate.getOne)
  async findEstimate(
    @Param('id') estimateId: bigint,
    @Query('includeStatistics', ParseBoolPipe) includeStatistics = false,
  ): Promise<EstimateResponseDto> {
    const query = new FindEstimateQuery(estimateId, includeStatistics);
    const result: FindEstimateQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (estimate) => this.mapper.toResponse(estimate),
      Err: (error) => {
        if (error instanceof EstimateNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
