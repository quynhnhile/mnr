import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobTaskPaginatedResponseDto } from '@modules/job-task/dtos/job-task.paginated.response.dto';
import { JobTaskMapper } from '@modules/job-task/mappers/job-task.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindJobTasksQuery,
  FindJobTasksQueryResult,
} from './find-job-tasks.query-handler';
import { FindJobTasksRequestDto } from './find-job-tasks.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { JobTaskScalarFieldEnum } from '../../database/job-task.repository.prisma';

@Controller(routesV1.version)
export class FindJobTasksHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: JobTaskMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_TASK.parent} - ${resourcesV1.JOB_TASK.displayName}`,
  )
  @ApiOperation({ summary: 'Find JobTasks' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobTaskPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.JOB_TASK.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.jobTask.root)
  async findJobTasks(
    @Query(
      new DirectFilterPipe<any, Prisma.JobTaskWhereInput>([
        JobTaskScalarFieldEnum.id,
        JobTaskScalarFieldEnum.jobTaskCode,
        JobTaskScalarFieldEnum.jobTaskName,
      ]),
    )
    queryParams: FindJobTasksRequestDto,
  ): Promise<JobTaskPaginatedResponseDto> {
    const query = new FindJobTasksQuery(queryParams.findOptions);
    const result: FindJobTasksQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new JobTaskPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
