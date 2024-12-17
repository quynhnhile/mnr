import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyDetailNotFoundError } from '@modules/survey/domain/survey-detail.error';
import { SurveyDetailResponseDto } from '@modules/survey/dtos/survey-detail.response.dto';
import { SurveyDetailMapper } from '@modules/survey/mappers/survey-detail.mapper';
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
  FindSurveyDetailQuery,
  FindSurveyDetailQueryResult,
} from './find-survey-detail.query-handler';

@Controller(routesV1.version)
export class FindSurveyDetailHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SurveyDetailMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Find one SurveyDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'surveyId',
    description: 'Survey ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiParam({
    name: 'id',
    description: 'SurveyDetail ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurveyDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SurveyDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.survey.surveyDetail.getOne)
  async findSurveyDetail(
    @Param('surveyId') surveyId: bigint,
    @Param('id') surveyDetailId: bigint,
  ): Promise<SurveyDetailResponseDto> {
    const query = new FindSurveyDetailQuery(surveyDetailId);
    const result: FindSurveyDetailQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (surveyDetail) => this.mapper.toResponse(surveyDetail),
      Err: (error) => {
        if (error instanceof SurveyDetailNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
