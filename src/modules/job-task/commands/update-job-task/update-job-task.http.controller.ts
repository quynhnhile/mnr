import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import {
  JobTaskCodeAlreadyExistsError,
  JobTaskCodeAlreadyInUseError,
  JobTaskNotFoundError,
} from '@modules/job-task/domain/job-task.error';
import { JobTaskResponseDto } from '@modules/job-task/dtos/job-task.response.dto';
import { JobTaskMapper } from '@modules/job-task/mappers/job-task.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
  ConflictException as ConflictHttpException,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateJobTaskCommand } from './update-job-task.command';
import { UpdateJobTaskRequestDto } from './update-job-task.request.dto';
import { UpdateJobTaskServiceResult } from './update-job-task.service';

@Controller(routesV1.version)
export class UpdateJobTaskHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: JobTaskMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_TASK.parent} - ${resourcesV1.JOB_TASK.displayName}`,
  )
  @ApiOperation({ summary: 'Update a JobTask' })
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: JobTaskCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: JobTaskCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_TASK.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.jobTask.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') jobTaskId: bigint,
    @Body() body: UpdateJobTaskRequestDto,
  ): Promise<JobTaskResponseDto> {
    const command = new UpdateJobTaskCommand({
      jobTaskId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateJobTaskServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (jobTask: JobTaskEntity) => this.mapper.toResponse(jobTask),
      Err: (error: Error) => {
        if (error instanceof JobTaskNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof JobTaskCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof JobTaskCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
