import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobRepairCleanPaginatedResponseDto } from '@modules/job-repair-clean/dtos/job-repair-clean.paginated.response.dto';
import { JobRepairCleanMapper } from '@modules/job-repair-clean/mappers/job-repair-clean.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindJobRepairCleansQuery,
  FindJobRepairCleansQueryResult,
} from './find-job-repair-cleans.query-handler';
import { FindJobRepairCleansRequestDto } from './find-job-repair-cleans.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { JobRepairCleanScalarFieldEnum } from '../../database/job-repair-clean.repository.prisma';

@Controller(routesV1.version)
export class FindJobRepairCleansHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: JobRepairCleanMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'Find JobRepairCleans' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobRepairCleanPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.jobRepairClean.root)
  async findJobRepairCleans(
    @Query(
      new DirectFilterPipe<any, Prisma.JobRepairCleanWhereInput>([
        JobRepairCleanScalarFieldEnum.id,
        JobRepairCleanScalarFieldEnum.idRef,
        JobRepairCleanScalarFieldEnum.idCont,
        JobRepairCleanScalarFieldEnum.containerNo,
        JobRepairCleanScalarFieldEnum.idEstItem,
        JobRepairCleanScalarFieldEnum.estimateNo,
        JobRepairCleanScalarFieldEnum.idJob,
        JobRepairCleanScalarFieldEnum.seq,
        JobRepairCleanScalarFieldEnum.repCode,
        JobRepairCleanScalarFieldEnum.isClean,
        JobRepairCleanScalarFieldEnum.cleanMethodCode,
        JobRepairCleanScalarFieldEnum.cleanModeCode,
        JobRepairCleanScalarFieldEnum.jobStatus,
        JobRepairCleanScalarFieldEnum.startDate,
        JobRepairCleanScalarFieldEnum.startBy,
        JobRepairCleanScalarFieldEnum.finishDate,
        JobRepairCleanScalarFieldEnum.finishBy,
        JobRepairCleanScalarFieldEnum.cancelDate,
        JobRepairCleanScalarFieldEnum.cancelBy,
        JobRepairCleanScalarFieldEnum.completeDate,
        JobRepairCleanScalarFieldEnum.completeBy,
        JobRepairCleanScalarFieldEnum.vendorCode,
        JobRepairCleanScalarFieldEnum.isReclean,
        JobRepairCleanScalarFieldEnum.idRefReclean,
        JobRepairCleanScalarFieldEnum.kcsStatus,
      ]),
    )
    queryParams: FindJobRepairCleansRequestDto,
  ): Promise<JobRepairCleanPaginatedResponseDto> {
    const query = new FindJobRepairCleansQuery(queryParams.findOptions);
    const result: FindJobRepairCleansQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new JobRepairCleanPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
