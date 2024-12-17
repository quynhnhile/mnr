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
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
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
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSurveyCommand } from './create-survey.command';
import { CreateSurveyRequestDto } from './create-survey.request.dto';
import { CreateSurveyServiceResult } from './create-survey.service';
import { EstimateStatus } from '@src/modules/estimate/domain/estimate.type';

@Controller(routesV1.version)
export class CreateSurveyHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Create a Survey' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SurveyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${InfoContNotFoundError.message} | ${SurveyLocationNotFoundError.message} | ${ConditionNotFoundError.message} | ${ClassifyNotFoundError.message} | ${CleanMethodNotFoundError.message} | ${CleanModeNotFoundError.message} | ${VendorNotFoundError.message} | ${RepairContNotFoundError.message} | ${SurveyNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.survey.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateSurveyRequestDto,
  ): Promise<SurveyResponseDto> {
    const {
      surveyDetails = [],
      localDmgDetails = [],
      estimate,
      ...restBody
    } = body;

    const command = new CreateSurveyCommand({
      ...restBody,
      surveyBy: user.username,
      createdBy: user.username,
      surveyDetails: surveyDetails.map((surveyDetail) => ({
        ...surveyDetail,
        containerNo: restBody.containerNo,
        surveyBy: user.username,
        createdBy: user.username,
        surveyNo: 'temp', // surveyNo is temporary
      })),
      localDmgDetails: localDmgDetails.map((localDmgDetail) => ({
        ...localDmgDetail,
        idSurvey: BigInt(0),
        idCont: 'temp',
        createdBy: user.username,
      })),
      estimate: estimate
        ? {
            ...estimate,
            idCont: restBody.containerNo, // idCont is temporary
            containerNo: restBody.containerNo,
            estimateNo: 'temp', // estimateNo is temporary
            estimateDate: new Date(),
            statusCode: EstimateStatus.ESTIMATE,
            estimateBy: user.username,
            createdBy: user.username,
            estimateDetails: estimate?.estimateDetails.length
              ? estimate?.estimateDetails.map((detail) => ({
                  ...detail,
                  idEstimate: BigInt(0), // idEstimate is temporary
                  estimateNo: 'temp', // estimateNo is temporary
                  createdBy: user.username,
                }))
              : [],
          }
        : undefined,
    });

    const result: CreateSurveyServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (survey: SurveyEntity) => this.mapper.toResponse(survey),
      Err: (error: Error) => {
        if (
          error instanceof InfoContNotFoundError ||
          error instanceof SurveyLocationNotFoundError ||
          error instanceof ConditionNotFoundError ||
          error instanceof ClassifyNotFoundError ||
          error instanceof CleanMethodNotFoundError ||
          error instanceof CleanModeNotFoundError ||
          error instanceof VendorNotFoundError ||
          error instanceof RepairContNotFoundError ||
          error instanceof SurveyNotFoundError
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
