import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateDetailScalarFieldEnum } from '@modules/estimate/database/estimate-detail.repository.prisma';
import { EstimateDetailPaginatedResponseDto } from '@modules/estimate/dtos/estimate-detail.paginated.response.dto';
import { EstimateDetailMapper } from '@modules/estimate/mappers/estimate-detail.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
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
  getSchemaPath,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  FindEstimateDetailsStartableQuery,
  FindEstimateDetailsStartableQueryResult,
} from './find-estimate-details-startable.query-handler';
import { FindEstimateDetailsStartableRequestDto } from './find-estimate-details-startable.request.dto';

@Controller(routesV1.version)
export class FindEstimateDetailsStartableHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: EstimateDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Find EstimateDetails startable' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'estimateId',
    description: 'Estimate ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiQuery({
    type: FindEstimateDetailsStartableRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindEstimateDetailsStartableRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EstimateDetailPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.estimate.estimateDetail.startable)
  async findEstimateDetails(
    @Param('estimateId') estimateId: bigint,
    @Query(
      new DirectFilterPipe<any, Prisma.EstimateDetailWhereInput>([
        EstimateDetailScalarFieldEnum.id,
        EstimateDetailScalarFieldEnum.compCode,
        EstimateDetailScalarFieldEnum.locCode,
        EstimateDetailScalarFieldEnum.damCode,
        EstimateDetailScalarFieldEnum.repCode,
        EstimateDetailScalarFieldEnum.length,
        EstimateDetailScalarFieldEnum.width,
        EstimateDetailScalarFieldEnum.quantity,
        EstimateDetailScalarFieldEnum.unit,
        EstimateDetailScalarFieldEnum.hours,
        EstimateDetailScalarFieldEnum.cwo,
        EstimateDetailScalarFieldEnum.laborRate,
        EstimateDetailScalarFieldEnum.laborPrice,
        EstimateDetailScalarFieldEnum.matePrice,
        EstimateDetailScalarFieldEnum.total,
        EstimateDetailScalarFieldEnum.currency,
        EstimateDetailScalarFieldEnum.payerCode,
        EstimateDetailScalarFieldEnum.rate,
        EstimateDetailScalarFieldEnum.isClean,
        EstimateDetailScalarFieldEnum.cleanMethodCode,
        EstimateDetailScalarFieldEnum.cleanModeCode,
        EstimateDetailScalarFieldEnum.statusCode,
        EstimateDetailScalarFieldEnum.localApprovalDate,
        EstimateDetailScalarFieldEnum.localApprovalBy,
        EstimateDetailScalarFieldEnum.approvalDate,
        EstimateDetailScalarFieldEnum.approvalBy,
        EstimateDetailScalarFieldEnum.reqActiveDate,
        EstimateDetailScalarFieldEnum.reqActiveBy,
        EstimateDetailScalarFieldEnum.cancelDate,
        EstimateDetailScalarFieldEnum.cancelBy,
        EstimateDetailScalarFieldEnum.isOprCancel,
      ]),
    )
    queryParams: FindEstimateDetailsStartableRequestDto,
  ): Promise<EstimateDetailPaginatedResponseDto> {
    // overwrite where to get only details of this estimate
    const where: Prisma.EstimateDetailWhereInput = {
      ...queryParams.findOptions.where,
      idEstimate: estimateId,
    };

    const query = new FindEstimateDetailsStartableQuery({
      ...queryParams.findOptions,
      where,
    });
    const result: FindEstimateDetailsStartableQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new EstimateDetailPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
