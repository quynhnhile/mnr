import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SurveyDetailNotFoundError } from '@src/modules/survey/domain/survey-detail.error';
import { SurveyDetailResponseDto } from '@src/modules/survey/dtos/survey-detail.response.dto';
import { SurveyDetailMapper } from '@src/modules/survey/mappers/survey-detail.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
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
import { UpdateSurveyDetailCommand } from './update-survey-detail.command';
import { UpdateSurveyDetailRequestDto } from './update-survey-detail.request.dto';
import { UpdateSurveyDetailServiceResult } from './update-survey-detail.service';

@Controller(routesV1.version)
export class UpdateSurveyDetailHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyDetailMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Update a SurveyDetail' })
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.survey.surveyDetail.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('surveyId') surveyId: bigint,
    @Param('id') surveyDetailId: bigint,
    @Body() body: UpdateSurveyDetailRequestDto,
  ): Promise<SurveyDetailResponseDto> {
    const command = new UpdateSurveyDetailCommand({
      surveyDetailId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateSurveyDetailServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (surveyDetail: SurveyDetailEntity) =>
        this.mapper.toResponse(surveyDetail),
      Err: (error: Error) => {
        if (error instanceof SurveyDetailNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
