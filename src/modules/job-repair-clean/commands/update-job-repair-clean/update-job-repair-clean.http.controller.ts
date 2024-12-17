import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { JobRepairCleanNotFoundError } from '@modules/job-repair-clean/domain/job-repair-clean.error';
import { JobRepairCleanResponseDto } from '@modules/job-repair-clean/dtos/job-repair-clean.response.dto';
import { JobRepairCleanMapper } from '@modules/job-repair-clean/mappers/job-repair-clean.mapper';
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
import { UpdateJobRepairCleanCommand } from './update-job-repair-clean.command';
import { UpdateJobRepairCleanRequestDto } from './update-job-repair-clean.request.dto';
import { UpdateJobRepairCleanServiceResult } from './update-job-repair-clean.service';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';

@Controller(routesV1.version)
export class UpdateJobRepairCleanHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: JobRepairCleanMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'Update a JobRepairClean' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'JobRepairClean ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobRepairCleanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${JobRepairCleanNotFoundError.message} | ${RepairNotFoundError.message} | ${VendorNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.jobRepairClean.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') jobRepairCleanId: bigint,
    @Body() body: UpdateJobRepairCleanRequestDto,
  ): Promise<JobRepairCleanResponseDto> {
    const command = new UpdateJobRepairCleanCommand({
      jobRepairCleanId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateJobRepairCleanServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (jobRepairClean: JobRepairCleanEntity) =>
        this.mapper.toResponse(jobRepairClean),
      Err: (error: Error) => {
        if (error instanceof JobRepairCleanNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (
          error instanceof RepairNotFoundError ||
          error instanceof VendorNotFoundError
        ) {
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
