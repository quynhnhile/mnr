import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { JobRepairCleanResponseDto } from '@modules/job-repair-clean/dtos/job-repair-clean.response.dto';
import { JobRepairCleanMapper } from '@modules/job-repair-clean/mappers/job-repair-clean.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  NotFoundException as NotFoundHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJobRepairCleanCommand } from './create-job-repair-clean.command';
import { CreateJobRepairCleanRequestDto } from './create-job-repair-clean.request.dto';
import { CreateJobRepairCleanServiceResult } from './create-job-repair-clean.service';
import { RepairContNotFoundError } from '@src/modules/repair-cont/domain/repair-cont.error';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';
import { EstimateDetailNotFoundError } from '@src/modules/estimate/domain/estimate-detail.error';

@Controller(routesV1.version)
export class CreateJobRepairCleanHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: JobRepairCleanMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'Create a JobRepairClean' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: JobRepairCleanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${RepairContNotFoundError.message} | ${EstimateDetailNotFoundError.message} | ${VendorNotFoundError.message} `,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.jobRepairClean.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateJobRepairCleanRequestDto,
  ): Promise<JobRepairCleanResponseDto> {
    const command = new CreateJobRepairCleanCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateJobRepairCleanServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (jobRepairClean: JobRepairCleanEntity) =>
        this.mapper.toResponse(jobRepairClean),
      Err: (error: Error) => {
        if (
          error instanceof RepairContNotFoundError ||
          error instanceof EstimateDetailNotFoundError ||
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
