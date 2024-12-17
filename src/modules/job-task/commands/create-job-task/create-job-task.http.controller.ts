import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import { JobTaskResponseDto } from '@modules/job-task/dtos/job-task.response.dto';
import { JobTaskMapper } from '@modules/job-task/mappers/job-task.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJobTaskCommand } from './create-job-task.command';
import { CreateJobTaskRequestDto } from './create-job-task.request.dto';
import { CreateJobTaskServiceResult } from './create-job-task.service';
import { JobTaskCodeAlreadyExistsError } from '../../domain/job-task.error';

@Controller(routesV1.version)
export class CreateJobTaskHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: JobTaskMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_TASK.parent} - ${resourcesV1.JOB_TASK.displayName}`,
  )
  @ApiOperation({ summary: 'Create a JobTask' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: JobTaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: JobTaskCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_TASK.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.jobTask.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateJobTaskRequestDto,
  ): Promise<JobTaskResponseDto> {
    const command = new CreateJobTaskCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateJobTaskServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (jobTask: JobTaskEntity) => this.mapper.toResponse(jobTask),
      Err: (error: Error) => {
        if (error instanceof JobTaskCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
