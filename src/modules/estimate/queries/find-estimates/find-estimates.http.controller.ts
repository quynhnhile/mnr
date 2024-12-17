import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateScalarFieldEnum } from '@modules/estimate/database/estimate.repository.prisma';
import { EstimatePaginatedResponseDto } from '@modules/estimate/dtos/estimate.paginated.response.dto';
import { EstimateMapper } from '@modules/estimate/mappers/estimate.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  FindEstimatesQuery,
  FindEstimatesQueryResult,
} from './find-estimates.query-handler';
import { FindEstimatesRequestDto } from './find-estimates.request.dto';

@Controller(routesV1.version)
export class FindEstimatesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: EstimateMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Find Estimates' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: EstimatePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.estimate.root)
  async findEstimates(
    @Query(
      new DirectFilterPipe<any, Prisma.EstimateWhereInput>([
        EstimateScalarFieldEnum.id,
        EstimateScalarFieldEnum.idRef,
        EstimateScalarFieldEnum.idCont,
        EstimateScalarFieldEnum.containerNo,
        EstimateScalarFieldEnum.estimateNo,
        EstimateScalarFieldEnum.estimateBy,
        EstimateScalarFieldEnum.estimateDate,
        EstimateScalarFieldEnum.statusCode,
        EstimateScalarFieldEnum.localApprovalBy,
        EstimateScalarFieldEnum.localApprovalDate,
        EstimateScalarFieldEnum.sendOprBy,
        EstimateScalarFieldEnum.sendOprDate,
        EstimateScalarFieldEnum.approvalBy,
        EstimateScalarFieldEnum.approvalDate,
        EstimateScalarFieldEnum.cancelBy,
        EstimateScalarFieldEnum.cancelDate,
        EstimateScalarFieldEnum.isOprCancel,
        EstimateScalarFieldEnum.reqActiveBy,
        EstimateScalarFieldEnum.reqActiveDate,
        EstimateScalarFieldEnum.altEstimateNo,
      ]),
    )
    queryParams: FindEstimatesRequestDto,
  ): Promise<EstimatePaginatedResponseDto> {
    const query = new FindEstimatesQuery(queryParams.findOptions);
    const result: FindEstimatesQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new EstimatePaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
