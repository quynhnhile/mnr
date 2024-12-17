import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ClassifyNotFoundError } from '@modules/classify/domain/classify.error';
import { CleanMethodNotFoundError } from '@modules/clean-method/domain/clean-method.error';
import { CleanModeNotFoundError } from '@modules/clean-mode/domain/clean-mode.error';
import { ConditionNotFoundError } from '@modules/condition/domain/condition.error';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { SurveyEntity } from '@modules/survey/domain/survey.entity';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import { SurveyResponseDto } from '@modules/survey/dtos/survey.response.dto';
import { SurveyMapper } from '@modules/survey/mappers/survey.mapper';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';
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
import { UpdateSurveyCommand } from './update-survey.command';
import { UpdateSurveyRequestDto } from './update-survey.request.dto';
import { UpdateSurveyServiceResult } from './update-survey.service';
import { EstimateDetailNotFoundError } from '@src/modules/estimate/domain/estimate-detail.error';

@Controller(routesV1.version)
export class UpdateSurveyHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Update a Survey' })
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
    description: `${SurveyNotFoundError.message} | ${InfoContNotFoundError.message} | ${SurveyLocationNotFoundError.message} | ${ConditionNotFoundError.message} | ${ClassifyNotFoundError.message} | ${CleanMethodNotFoundError.message} | ${CleanModeNotFoundError.message} | ${VendorNotFoundError.message} | ${EstimateDetailNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.survey.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') surveyId: bigint,
    @Body() body: UpdateSurveyRequestDto,
  ): Promise<SurveyResponseDto> {
    const { estimate, localDmgDetails = [] } = body;

    const command = new UpdateSurveyCommand({
      surveyId,
      ...body,
      updatedBy: user.username,
      localDmgDetails: localDmgDetails.map((localDmgDetail) => ({
        ...localDmgDetail,
        idSurvey: BigInt(0),
        idCont: 'temp',
        createdBy: user.username,
        updatedBy: user.username,
      })),
      estimate: estimate
        ? {
            ...estimate,
            id: estimate.id ? estimate.id : -1000,
            estimateDetails: estimate?.estimateDetails.length
              ? estimate?.estimateDetails.map((detail) => ({
                  ...detail,
                  id: detail.id ? detail.id : undefined,
                  idEstimate: BigInt(0),
                  estimateNo: 'temp',
                  createdBy: user.username,
                }))
              : [],
          }
        : undefined,
    });

    const result: UpdateSurveyServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (survey: SurveyEntity) => this.mapper.toResponse(survey),
      Err: (error: Error) => {
        if (
          error instanceof SurveyNotFoundError ||
          error instanceof InfoContNotFoundError ||
          error instanceof SurveyLocationNotFoundError ||
          error instanceof ConditionNotFoundError ||
          error instanceof ClassifyNotFoundError ||
          error instanceof CleanMethodNotFoundError ||
          error instanceof CleanModeNotFoundError ||
          error instanceof VendorNotFoundError ||
          error instanceof EstimateDetailNotFoundError
        ) {
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
