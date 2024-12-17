import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  QueryContByContainerNosQuery,
  QueryContByContainerNosQueryResult,
} from './query-cont-by-cont-nos.query-handler';
import { QueryContByContNosRequestDto } from './query-cont-by-cont-nos.request.dto';
import { QueryContByContNosResponseDto } from './query-cont-by-cont-nos.response.dto';

@Controller(routesV1.version)
export class QueryContByContNosHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Query conts by containernos to update data' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: QueryContByContNosResponseDto,
  })
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.repairCont.queryContByContNos)
  async queryContByContNos(
    @Query()
    queryParams: QueryContByContNosRequestDto,
  ): Promise<{ data: QueryContByContNosResponseDto[] }> {
    const query = new QueryContByContainerNosQuery(queryParams);
    const result: QueryContByContainerNosQueryResult =
      await this.queryBus.execute(query);

    return match(result, {
      Ok: (data) => {
        const detailResponse = data.map((item) => {
          const response = new QueryContByContNosResponseDto();
          response.id = Number(item.id);
          response.containerNo = item.containerNo;
          response.operationCode = item.operationCode;
          response.localSizeType = item.localSizeType;
          response.isoSizeType = item.isoSizeType;
          response.conditionCode = item.conditionCode;
          response.classifyCode = item.classifyCode;
          response.estimateNo = item.estimateNo;
          response.dateIn = item.dateIn;
          response.estimateNo = item.estimateNo;
          response.noteSurvey = item.noteSurvey;
          response.noteEstimate = item.noteEstimate;
          response.estimateDate = item.estimateDate;
          response.estimateBy = item.estimateBy;
          response.approvalDate = item.approvalDate;
          response.approvalBy = item.approvalBy;
          response.localApprovalDate = item.localApprovalDate;
          response.localApprovalBy = item.localApprovalBy;
          response.completeDate = item.completeDate;
          response.completeBy = item.completeBy;
          response.total = item.total;
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
