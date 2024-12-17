import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobRepairCleanNotFoundError } from '@modules/job-repair-clean/domain/job-repair-clean.error';
import { JobRepairCleanResponseDto } from '@modules/job-repair-clean/dtos/job-repair-clean.response.dto';
import { JobRepairCleanMapper } from '@modules/job-repair-clean/mappers/job-repair-clean.mapper';
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
  FindJobRepairCleanQuery,
  FindJobRepairCleanQueryResult,
} from './find-job-repair-clean.query-handler';

@Controller(routesV1.version)
export class FindJobRepairCleanHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: JobRepairCleanMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'Find one JobRepairClean' })
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
    description: JobRepairCleanNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.jobRepairClean.getOne)
  async findJobRepairClean(
    @Param('id') jobRepairCleanId: bigint,
  ): Promise<JobRepairCleanResponseDto> {
    const query = new FindJobRepairCleanQuery(jobRepairCleanId);
    const result: FindJobRepairCleanQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (jobRepairClean) => this.mapper.toResponse(jobRepairClean),
      Err: (error) => {
        if (error instanceof JobRepairCleanNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
