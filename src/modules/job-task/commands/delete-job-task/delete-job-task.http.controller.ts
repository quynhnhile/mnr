import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobTaskNotFoundError } from '@modules/job-task/domain/job-task.error';
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
import { DeleteJobTaskCommand } from './delete-job-task.command';
import { DeleteJobTaskServiceResult } from './delete-job-task.service';

@Controller(routesV1.version)
export class DeleteJobTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.JOB_TASK.parent} - ${resourcesV1.JOB_TASK.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a JobTask' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'JobTask ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'JobTask deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: JobTaskNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_TASK.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.jobTask.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') jobTaskId: bigint): Promise<void> {
    const command = new DeleteJobTaskCommand({ jobTaskId });
    const result: DeleteJobTaskServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof JobTaskNotFoundError) {
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
