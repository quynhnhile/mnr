import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyScalarFieldEnum } from '@modules/survey/database/survey.repository.prisma';
import { SurveyPaginatedResponseDto } from '@modules/survey/dtos/survey.paginated.response.dto';
import { SurveyMapper } from '@modules/survey/mappers/survey.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  FindSurveysQuery,
  FindSurveysQueryResult,
} from './find-surveys.query-handler';
import { FindSurveysRequestDto } from './find-surveys.request.dto';

@Controller(routesV1.version)
export class FindSurveysHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SurveyMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Find Surveys' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindSurveysRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindSurveysRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurveyPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.survey.root)
  async findSurveys(
    @Query(
      new DirectFilterPipe<any, Prisma.SurveyWhereInput>([
        SurveyScalarFieldEnum.id,
        SurveyScalarFieldEnum.idRep,
        SurveyScalarFieldEnum.idCont,
        SurveyScalarFieldEnum.containerNo,
        SurveyScalarFieldEnum.surveyNo,
        SurveyScalarFieldEnum.eirNo,
        SurveyScalarFieldEnum.fe,
        SurveyScalarFieldEnum.isInOut,
        SurveyScalarFieldEnum.surveyLocationCode,
        SurveyScalarFieldEnum.contAge,
        SurveyScalarFieldEnum.machineAge,
        SurveyScalarFieldEnum.machineBrand,
        SurveyScalarFieldEnum.machineModel,
        SurveyScalarFieldEnum.conditionCode,
        SurveyScalarFieldEnum.conditionMachineCode,
        SurveyScalarFieldEnum.classifyCode,
        SurveyScalarFieldEnum.cleanMethodCode,
        SurveyScalarFieldEnum.cleanModeCode,
        SurveyScalarFieldEnum.deposit,
        SurveyScalarFieldEnum.vendorCode,
        SurveyScalarFieldEnum.idCheck,
        SurveyScalarFieldEnum.checkNo,
        SurveyScalarFieldEnum.isTankOutside,
        SurveyScalarFieldEnum.isTankInside,
        SurveyScalarFieldEnum.isTest1bar,
        SurveyScalarFieldEnum.preSurveyNo,
        SurveyScalarFieldEnum.surveyDate,
        SurveyScalarFieldEnum.surveyBy,
        SurveyScalarFieldEnum.finishDate,
        SurveyScalarFieldEnum.finishBy,
        SurveyScalarFieldEnum.isRemoveMark,
        SurveyScalarFieldEnum.removeMark,
        SurveyScalarFieldEnum.isRevice,
        SurveyScalarFieldEnum.altSurveyNo,
        SurveyScalarFieldEnum.isException,
        SurveyScalarFieldEnum.pti,
        SurveyScalarFieldEnum.noteMachine,
      ]),
    )
    queryParams: FindSurveysRequestDto,
  ): Promise<SurveyPaginatedResponseDto> {
    const query = new FindSurveysQuery(queryParams.findOptions);
    const result: FindSurveysQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new SurveyPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
