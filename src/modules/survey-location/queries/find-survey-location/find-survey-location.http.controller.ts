import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { SurveyLocationResponseDto } from '@modules/survey-location/dtos/survey-location.response.dto';
import { SurveyLocationMapper } from '@modules/survey-location/mappers/survey-location.mapper';
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
  FindSurveyLocationQuery,
  FindSurveyLocationQueryResult,
} from './find-survey-location.query-handler';

@Controller(routesV1.version)
export class FindSurveyLocationHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SurveyLocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SURVEY_LOCATION.parent} - ${resourcesV1.SURVEY_LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Find one SurveyLocation' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'SurveyLocation ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurveyLocationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SurveyLocationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY_LOCATION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.surveyLocation.getOne)
  async findSurveyLocation(
    @Param('id') surveyLocationId: bigint,
  ): Promise<SurveyLocationResponseDto> {
    const query = new FindSurveyLocationQuery(surveyLocationId);
    const result: FindSurveyLocationQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (surveyLocation) => this.mapper.toResponse(surveyLocation),
      Err: (error) => {
        if (error instanceof SurveyLocationNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
