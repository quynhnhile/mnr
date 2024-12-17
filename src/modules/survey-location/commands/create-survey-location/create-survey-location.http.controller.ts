import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { SurveyLocationResponseDto } from '@modules/survey-location/dtos/survey-location.response.dto';
import { SurveyLocationMapper } from '@modules/survey-location/mappers/survey-location.mapper';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSurveyLocationCommand } from './create-survey-location.command';
import { CreateSurveyLocationRequestDto } from './create-survey-location.request.dto';
import { CreateSurveyLocationServiceResult } from './create-survey-location.service';

@Controller(routesV1.version)
export class CreateSurveyLocationHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyLocationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SURVEY_LOCATION.parent} - ${resourcesV1.SURVEY_LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Create a SurveyLocation' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SurveyLocationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY_LOCATION.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.surveyLocation.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateSurveyLocationRequestDto,
  ): Promise<SurveyLocationResponseDto> {
    const command = new CreateSurveyLocationCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateSurveyLocationServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (surveyLocation: SurveyLocationEntity) =>
        this.mapper.toResponse(surveyLocation),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
