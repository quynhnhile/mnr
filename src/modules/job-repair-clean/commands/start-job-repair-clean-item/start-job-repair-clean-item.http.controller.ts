import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Post,
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
import { StartJobRepairCleanItemCommand } from './start-job-repair-clean-item.command';
import { StartJobRepairCleanItemServiceResult } from './start-job-repair-clean-item.service';
import { JobRepairCleanMapper } from '../../mappers/job-repair-clean.mapper';
import { JobRepairCleanResponseDto } from '../../dtos/job-repair-clean.response.dto';
import {
  JobRepairCleanAlreadyStartedOrCanceledError,
  JobRepairCleanNotFoundError,
} from '../../domain/job-repair-clean.error';
import { JobRepairCleanEntity } from '../../domain/job-repair-clean.entity';
import { StartJobRepairCleanItemRequestDto } from './start-job-repair-clean-item.request.dto';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';

@Controller(routesV1.version)
export class StartJobRepairCleanItemHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: JobRepairCleanMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'start job repair clean item' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Estimate detail ID',
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
    description: `${JobRepairCleanNotFoundError.message} | ${VendorNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: JobRepairCleanAlreadyStartedOrCanceledError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.jobRepairClean.start)
  async create(
    @ReqUser() user: RequestUser,
    @Param('id') estimateDetailId: bigint,
    @Body() body: StartJobRepairCleanItemRequestDto,
  ): Promise<JobRepairCleanResponseDto> {
    const command = new StartJobRepairCleanItemCommand({
      estimateDetailId,
      ...body,
      startBy: user.username,
      createdBy: user.username,
    });

    const result: StartJobRepairCleanItemServiceResult =
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
        if (error instanceof JobRepairCleanAlreadyStartedOrCanceledError) {
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
