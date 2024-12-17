import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import { SurveyResponseDto } from '@modules/survey/dtos/survey.response.dto';
import { SurveyMapper } from '@modules/survey/mappers/survey.mapper';
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
  FindSurveyQuery,
  FindSurveyQueryResult,
} from './find-survey.query-handler';

@Controller(routesV1.version)
export class FindSurveyHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SurveyMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Find one Survey' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Survey ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurveyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SurveyNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.survey.getOne)
  async findSurvey(@Param('id') surveyId: bigint): Promise<SurveyResponseDto> {
    const query = new FindSurveyQuery(surveyId);
    const result: FindSurveyQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (survey) => this.mapper.toResponse(survey),
      Err: (error) => {
        if (error instanceof SurveyNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
