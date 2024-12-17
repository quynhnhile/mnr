import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { EstimateDetailResponseDto } from '@modules/estimate/dtos/estimate-detail.response.dto';
import { EstimateDetailMapper } from '@modules/estimate/mappers/estimate-detail.mapper';
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
  FindEstimateDetailQuery,
  FindEstimateDetailQueryResult,
} from './find-estimate-detail.query-handler';

@Controller(routesV1.version)
export class FindEstimateDetailHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: EstimateDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one EstimateDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'estimateId',
    description: 'Estimate ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'id',
    description: 'EstimateDetail ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EstimateDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.estimate.estimateDetail.getOne)
  async findEstimateDetail(
    @Param('estimateId') estimateId: bigint,
    @Param('id') estimateDetailId: bigint,
  ): Promise<EstimateDetailResponseDto> {
    const query = new FindEstimateDetailQuery(estimateId, estimateDetailId);
    const result: FindEstimateDetailQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (estimateDetail) => this.mapper.toResponse(estimateDetail),
      Err: (error) => {
        if (error instanceof EstimateDetailNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
