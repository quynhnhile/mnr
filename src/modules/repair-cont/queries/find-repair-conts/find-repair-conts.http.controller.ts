import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContPaginatedResponseDto } from '@modules/repair-cont/dtos/repair-cont.paginated.response.dto';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindRepairContsQuery,
  FindRepairContsQueryResult,
} from './find-repair-conts.query-handler';
import { FindRepairContsRequestDto } from './find-repair-conts.request.dto';
import { Prisma } from '@prisma/client';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { RepairContScalarFieldEnum } from '../../database/repair-cont.repository.prisma';

@Controller(routesV1.version)
export class FindRepairContsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Find RepairConts' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RepairContPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.repairCont.root)
  async findRepairConts(
    @Query(
      new DirectFilterPipe<any, Prisma.RepairContWhereInput>([
        RepairContScalarFieldEnum.id,
        RepairContScalarFieldEnum.idCont,
        RepairContScalarFieldEnum.containerNo,
        RepairContScalarFieldEnum.operationCode,
        RepairContScalarFieldEnum.pinCode,
        RepairContScalarFieldEnum.orderNo,
        RepairContScalarFieldEnum.bookingNo,
        RepairContScalarFieldEnum.blNo,
        RepairContScalarFieldEnum.location,
        RepairContScalarFieldEnum.localSizeType,
        RepairContScalarFieldEnum.isoSizeType,
        RepairContScalarFieldEnum.conditionCode,
        RepairContScalarFieldEnum.classifyCode,
        RepairContScalarFieldEnum.conditionMachineCode,
        RepairContScalarFieldEnum.conditionCodeAfter,
        RepairContScalarFieldEnum.conditionMachineCodeAfter,
        RepairContScalarFieldEnum.factoryDate,
        RepairContScalarFieldEnum.statusCode,
        RepairContScalarFieldEnum.surveyInNo,
        RepairContScalarFieldEnum.surveyOutNo,
        RepairContScalarFieldEnum.estimateNo,
        RepairContScalarFieldEnum.isComplete,
        RepairContScalarFieldEnum.completeDate,
        RepairContScalarFieldEnum.completeBy,
        RepairContScalarFieldEnum.billCheck,
        RepairContScalarFieldEnum.billDate,
        RepairContScalarFieldEnum.billOprConfirm,
        RepairContScalarFieldEnum.isPosted,
      ]),
    )
    queryParams: FindRepairContsRequestDto,
  ): Promise<RepairContPaginatedResponseDto> {
    const query = new FindRepairContsQuery(queryParams.findOptions);
    const result: FindRepairContsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new RepairContPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
