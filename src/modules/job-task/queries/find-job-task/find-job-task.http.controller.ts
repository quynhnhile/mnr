import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobTaskNotFoundError } from '@modules/job-task/domain/job-task.error';
import { JobTaskResponseDto } from '@modules/job-task/dtos/job-task.response.dto';
import { JobTaskMapper } from '@modules/job-task/mappers/job-task.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindJobTaskQuery,
  FindJobTaskQueryResult,
} from './find-job-task.query-handler';

@Controller(routesV1.version)
export class FindJobTaskHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: JobTaskMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_TASK.parent} - ${resourcesV1.JOB_TASK.displayName}`,
  )
  @ApiOperation({ summary: 'Find one JobTask' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'JobTask ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobTaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: JobTaskNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_TASK.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.jobTask.getOne)
  async findJobTask(
    @Param('id') jobTaskId: bigint,
  ): Promise<JobTaskResponseDto> {
    const query = new FindJobTaskQuery(jobTaskId);
    const result: FindJobTaskQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (jobTask) => this.mapper.toResponse(jobTask),
      Err: (error) => {
        if (error instanceof JobTaskNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
