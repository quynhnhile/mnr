import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
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
import { FinishSurveyCommand } from './finish-survey.command';
import { FinishSurveyServiceResult } from './finish-survey.service';
import { SurveyMapper } from '../../mappers/survey.mapper';
import { SurveyResponseDto } from '../../dtos/survey.response.dto';
import { SurveyNotFoundError } from '../../domain/survey.error';
import { SurveyEntity } from '../../domain/survey.entity';
import { FinishSurveyRequestDto } from './finish-survey.request.dto';

@Controller(routesV1.version)
export class FinishSurveyHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SurveyMapper,
  ) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'finish Survey' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Survey ID',
    type: 'string',
    required: true,
    example: 1,
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
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.survey.finish)
  async cancel(
    @ReqUser() user: RequestUser,
    @Param('id') surveyId: bigint,
    @Body() body: FinishSurveyRequestDto,
  ): Promise<SurveyResponseDto> {
    const command = new FinishSurveyCommand({
      surveyId,
      ...body,
      finishBy: user.username,
      updatedBy: user.username,
    });

    const result: FinishSurveyServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (survey: SurveyEntity) => this.mapper.toResponse(survey),
      Err: (error: Error) => {
        if (error instanceof SurveyNotFoundError) {
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
