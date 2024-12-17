import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
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
import { DeleteSurveyLocationCommand } from './delete-survey-location.command';
import { DeleteSurveyLocationServiceResult } from './delete-survey-location.service';

@Controller(routesV1.version)
export class DeleteSurveyLocationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.SURVEY_LOCATION.parent} - ${resourcesV1.SURVEY_LOCATION.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a SurveyLocation' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'SurveyLocation ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'SurveyLocation deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SurveyLocationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SURVEY_LOCATION.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.surveyLocation.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') surveyLocationId: bigint): Promise<void> {
    const command = new DeleteSurveyLocationCommand({ surveyLocationId });
    const result: DeleteSurveyLocationServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
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
