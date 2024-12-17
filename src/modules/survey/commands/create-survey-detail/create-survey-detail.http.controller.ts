import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SurveyDetailResponseDto } from '@src/modules/survey/dtos/survey-detail.response.dto';
import { SurveyDetailMapper } from '@src/modules/survey/mappers/survey-detail.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSurveyDetailCommand } from './create-survey-detail.command';
import { CreateSurveyDetailRequestDto } from './create-survey-detail.request.dto';
import { CreateSurveyDetailServiceResult } from './create-survey-detail.service';

@Controller(routesV1.version)
export class CreateSurveyDetailHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyDetailMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Create a SurveyDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'surveyId',
    description: 'Survey ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SurveyDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.survey.surveyDetail.root)
  async create(
    @ReqUser() user: RequestUser,
    @Param('surveyId') surveyId: bigint,
    @Body() body: CreateSurveyDetailRequestDto,
  ): Promise<SurveyDetailResponseDto> {
    const command = new CreateSurveyDetailCommand({
      ...body,
      idSurvey: surveyId,
      surveyDate: new Date(),
      surveyBy: user.username,
      createdBy: user.username,
    });

    const result: CreateSurveyDetailServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (surveyDetail: SurveyDetailEntity) =>
        this.mapper.toResponse(surveyDetail),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
