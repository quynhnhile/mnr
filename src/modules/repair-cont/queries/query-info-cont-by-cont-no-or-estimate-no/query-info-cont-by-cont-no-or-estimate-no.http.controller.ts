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
  QueryInfoContByContainerNoOrEstimateNoQuery,
  QueryInfoContByContainerNoOrEstimateNoQueryResult,
} from './query-info-cont-by-cont-no-or-estimate-no.query-handler';
import { QueryInfoContByContNoOrEstimateNoResponseDto } from './query-info-cont-by-cont-no-or-estimate-no.response.dto';
import { QueryInfoContByContNoOrEstimateNoRequestDto } from './query-info-cont-by-cont-no-or-estimate-no.request.dto';

@Controller(routesV1.version)
export class QueryInfoContByContainerNoOrEstimateNoHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Query info cont by container no or estimate no' })
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
    type: QueryInfoContByContNoOrEstimateNoResponseDto,
  })
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.repairCont.queryInfoCont)
  async queryInfoContByContNoOrEstimateNo(
    @Query()
    queryParams: QueryInfoContByContNoOrEstimateNoRequestDto,
  ): Promise<any> {
    const query = new QueryInfoContByContainerNoOrEstimateNoQuery(queryParams);
    const result: QueryInfoContByContainerNoOrEstimateNoQueryResult =
      await this.queryBus.execute(query);
    const infoCont = result.unwrap();

    const response = new QueryInfoContByContNoOrEstimateNoResponseDto();
    response.containerNo = infoCont.containerNo;
    response.orderNo = infoCont.orderNo;
    response.operationCode = infoCont.operationCode;
    response.localSizeType = infoCont.localSizeType;
    response.location = infoCont.location;
    response.containerStatusCode = infoCont.containerStatusCode;
    response.conditionCode = infoCont.conditionCode;
    response.dateIn = infoCont.dateIn;
    response.noteSurvey = infoCont.noteSurvey;
    response.estimateNo = infoCont.estimateNo;
    response.statusCode = infoCont.statusCode;
    response.noteEstimate = infoCont.noteEstimate;
    response.deposit = infoCont.deposit;
    response.estimateDetails = infoCont.estimateDetails;

    console.log('check response: ', response);
    return response;
  }
}
