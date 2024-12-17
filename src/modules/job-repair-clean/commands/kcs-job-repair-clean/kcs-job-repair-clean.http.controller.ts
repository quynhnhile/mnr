import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
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
import { KcsJobRepairCleanCommand } from './kcs-job-repair-clean.command';
import { KcsJobRepairCleanServiceResult } from './kcs-job-repair-clean.service';
import { JobRepairCleanMapper } from '../../mappers/job-repair-clean.mapper';
import { JobRepairCleanResponseDto } from '../../dtos/job-repair-clean.response.dto';
import { JobRepairCleanNotFoundError } from '../../domain/job-repair-clean.error';
import { JobRepairCleanEntity } from '../../domain/job-repair-clean.entity';
import { KcsJobRepairCleanRequestDto } from './kcs-job-repair-clean.request.dto';

@Controller(routesV1.version)
export class KcsJobRepairCleanHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: JobRepairCleanMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'kcs job repair clean' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Job repair clean ID',
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
    description: JobRepairCleanNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.jobRepairClean.kcs)
  async approve(
    @ReqUser() user: RequestUser,
    @Param('id') jobRepairCleanId: bigint,
    @Body() body: KcsJobRepairCleanRequestDto,
  ): Promise<JobRepairCleanResponseDto> {
    const command = new KcsJobRepairCleanCommand({
      jobRepairCleanId,
      ...body,
      updatedBy: user.username,
    });

    const result: KcsJobRepairCleanServiceResult =
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
        throw error;
      },
    });
  }
}
