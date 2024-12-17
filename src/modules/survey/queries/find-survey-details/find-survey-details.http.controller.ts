import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyDetailScalarFieldEnum } from '@modules/survey/database/survey-detail.repository.prisma';
import { SurveyDetailPaginatedResponseDto } from '@modules/survey/dtos/survey-detail.paginated.response.dto';
import { SurveyDetailMapper } from '@modules/survey/mappers/survey-detail.mapper';
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
  FindSurveyDetailsQuery,
  FindSurveyDetailsQueryResult,
} from './find-survey-details.query-handler';
import { FindSurveyDetailsRequestDto } from './find-survey-details.request.dto';

@Controller(routesV1.version)
export class FindSurveyDetailsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SurveyDetailMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Find SurveyDetails' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'surveyId',
    description: 'Survey ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiQuery({
    type: FindSurveyDetailsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindSurveyDetailsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurveyDetailPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.survey.surveyDetail.root)
  async findSurveyDetails(
    @Param('surveyId') surveyId: bigint,
    @Query(
      new DirectFilterPipe<any, Prisma.SurveyDetailWhereInput>([
        SurveyDetailScalarFieldEnum.id,
        SurveyDetailScalarFieldEnum.idSurvey,
        SurveyDetailScalarFieldEnum.idCont,
        SurveyDetailScalarFieldEnum.containerNo,
        SurveyDetailScalarFieldEnum.surveyNo,
        SurveyDetailScalarFieldEnum.surveyDate,
        SurveyDetailScalarFieldEnum.surveyBy,
      ]),
    )
    queryParams: FindSurveyDetailsRequestDto,
  ): Promise<SurveyDetailPaginatedResponseDto> {
    const query = new FindSurveyDetailsQuery(queryParams.findOptions);
    const result: FindSurveyDetailsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new SurveyDetailPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
