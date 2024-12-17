import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyLocationScalarFieldEnum } from '@modules/survey-location/database/survey-location.repository.prisma';
import { SurveyLocationPaginatedResponseDto } from '@modules/survey-location/dtos/survey-location.paginated.response.dto';
import { SurveyLocationMapper } from '@modules/survey-location/mappers/survey-location.mapper';
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
  FindSurveyLocationsQuery,
  FindSurveyLocationsQueryResult,
} from './find-survey-locations.query-handler';
import { FindSurveyLocationsRequestDto } from './find-survey-locations.request.dto';

@Controller(routesV1.version)
export class FindSurveyLocationsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SurveyLocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SURVEY_LOCATION.parent} - ${resourcesV1.SURVEY_LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Find SurveyLocations' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindSurveyLocationsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindSurveyLocationsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurveyLocationPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.SURVEY_LOCATION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.surveyLocation.root)
  async findSurveyLocations(
    @Query(
      new DirectFilterPipe<any, Prisma.SurveyLocationWhereInput>([
        SurveyLocationScalarFieldEnum.id,
        SurveyLocationScalarFieldEnum.surveyLocationCode,
        SurveyLocationScalarFieldEnum.surveyLocationName,
      ]),
    )
    queryParams: FindSurveyLocationsRequestDto,
  ): Promise<SurveyLocationPaginatedResponseDto> {
    const query = new FindSurveyLocationsQuery(queryParams.findOptions);
    const result: FindSurveyLocationsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new SurveyLocationPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
