import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { SurveyLocationResponseDto } from '@modules/survey-location/dtos/survey-location.response.dto';
import { SurveyLocationMapper } from '@modules/survey-location/mappers/survey-location.mapper';
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
import { UpdateSurveyLocationCommand } from './update-survey-location.command';
import { UpdateSurveyLocationRequestDto } from './update-survey-location.request.dto';
import { UpdateSurveyLocationServiceResult } from './update-survey-location.service';

@Controller(routesV1.version)
export class UpdateSurveyLocationHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyLocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SURVEY_LOCATION.parent} - ${resourcesV1.SURVEY_LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Update a SurveyLocation' })
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY_LOCATION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.surveyLocation.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') surveyLocationId: bigint,
    @Body() body: UpdateSurveyLocationRequestDto,
  ): Promise<SurveyLocationResponseDto> {
    const command = new UpdateSurveyLocationCommand({
      surveyLocationId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateSurveyLocationServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (surveyLocation: SurveyLocationEntity) =>
        this.mapper.toResponse(surveyLocation),
      Err: (error: Error) => {
        if (error instanceof SurveyLocationNotFoundError) {
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
