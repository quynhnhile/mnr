import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetCleaningAndRepairQuery,
  GetCleaningAndRepairQueryResult,
} from './cleaning-and-repair.query-handler';
import { ReportCleaningAndRepairResponseDto } from './cleaning-and-repair.response.dto';
import { ReportCleaningAndRepairRequestDto } from './cleaning-and-repair.request.dto';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class ReportCleaningAndRepairHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiTags(`${resourcesV1.REPORT.parent} - ${resourcesV1.REPORT.displayName}`)
  @ApiOperation({ summary: 'Report cleaning and repair' })
  @ApiBearerAuth()
  // @ApiParam({
  //   name: 'containerNo',
  //   description: 'Container No',
  //   type: 'string',
  //   required: true,
  //   example: 'BEAU5565497',
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReportCleaningAndRepairResponseDto,
  })
  @AuthPermission(resourcesV1.REPORT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.report.cleaningAndRepair)
  async reportCleaningAndRepair(
    @Query()
    queryParams: ReportCleaningAndRepairRequestDto,
  ): Promise<{ data: ReportCleaningAndRepairResponseDto[] }> {
    const query = new GetCleaningAndRepairQuery(queryParams);
    const result: GetCleaningAndRepairQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (data) => {
        const detailResponse = data.map((item) => {
          const response = new ReportCleaningAndRepairResponseDto();
          response.containerNo = item.containerNo;
          response.dateIn = item.dateIn;
          response.estimateDate = item.estimateDate;
          response.estimateBy = item.estimateBy;
          response.localApprovalDate = item.localApprovalDate;
          response.localApprovalBy = item.localApprovalBy;
          response.approvalDate = item.approvalDate;
          response.approvalBy = item.approvalBy;
          response.completeDate = item.completeDate;
          response.completeBy = item.completeBy;
          response.localSizeType = item.localSizeType;
          response.operationCode = item.operationCode;
          response.estimateNo = item.estimateNo;
          response.isClean = item.isClean;
          response.hours = item.hours;
          response.total = item.total;
          response.payerCode = item.payerCode;
          response.yardCode = item.yardCode;
          return response;
        });
        return { data: detailResponse };
      },
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
