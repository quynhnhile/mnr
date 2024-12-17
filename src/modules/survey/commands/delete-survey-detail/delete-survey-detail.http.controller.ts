import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyDetailNotFoundError } from '@modules/survey/domain/survey-detail.error';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
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
import { DeleteSurveyDetailCommand } from './delete-survey-detail.command';
import { DeleteSurveyDetailServiceResult } from './delete-survey-detail.service';

@Controller(routesV1.version)
export class DeleteSurveyDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.SURVEY.parent} - ${resourcesV1.SURVEY.displayName}`)
  @ApiOperation({ summary: 'Delete a SurveyDetail' })
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
    status: HttpStatus.NO_CONTENT,
    description: 'SurveyDetail deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SurveyDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.survey.surveyDetail.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('surveyId') surveyId: bigint,
    @Param('id') surveyDetailId: bigint,
  ): Promise<void> {
    const command = new DeleteSurveyDetailCommand({ surveyDetailId });
    const result: DeleteSurveyDetailServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
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
