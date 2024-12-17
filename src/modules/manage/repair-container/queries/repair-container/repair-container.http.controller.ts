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
  GetManageRepairContainerQuery,
  GetManageRepairContainerQueryResult,
} from './repair-container.query-handler';
import { ManageRepairContainerResponseDto } from './repair-container.response.dto';
import { ManageRepairContainerRequestDto } from './repair-container.request.dto';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class ManageRepairContainerHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiTags(`${resourcesV1.MANAGE.parent} - ${resourcesV1.MANAGE.displayName}`)
  @ApiOperation({ summary: 'Manage repair container' })
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
    type: ManageRepairContainerResponseDto,
  })
  @AuthPermission(resourcesV1.MANAGE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.manage.manageRepairContainer)
  async reportCleaningAndRepair(
    @Query()
    queryParams: ManageRepairContainerRequestDto,
  ): Promise<{ data: ManageRepairContainerResponseDto[] }> {
    const query = new GetManageRepairContainerQuery(queryParams);
    const result: GetManageRepairContainerQueryResult =
      await this.queryBus.execute(query);

    return match(result, {
      Ok: (data) => {
        const detailResponse = data.map((item) => {
          const response = new ManageRepairContainerResponseDto();
          response.containerNo = item.containerNo;
          response.dateIn = item.dateIn;
          response.isRevice = item.isRevice;
          response.estimateDate = item.estimateDate;
          response.estimateBy = item.estimateBy;
          response.approvalDate = item.approvalDate;
          response.approvalBy = item.approvalBy;
          response.completeDate = item.completeDate;
          response.completeBy = item.completeBy;
          response.conditionCode = item.conditionCode;
          response.noteSurvey = item.noteSurvey;
          response.noteEstimate = item.noteEstimate;
          response.localSizeType = item.localSizeType;
          response.operationCode = item.operationCode;
          response.estimateNo = item.estimateNo;
          response.total = item.total;
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
