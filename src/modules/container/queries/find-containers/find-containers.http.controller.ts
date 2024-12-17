import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContainerScalarFieldEnum } from '@modules/container/database/container.repository.prisma';
import { ContainerPaginatedResponseDto } from '@modules/container/dtos/container.paginated.response.dto';
import { ContainerMapper } from '@modules/container/mappers/container.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  FindContainersQuery,
  FindContainersQueryResult,
} from './find-containers.query-handler';
import { FindContainersRequestDto } from './find-containers.request.dto';

@Controller(routesV1.version)
export class FindContainersHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ContainerMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONTAINER.parent} - ${resourcesV1.CONTAINER.displayName}`,
  )
  @ApiOperation({ summary: 'Find Containers' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FilterDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FilterDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ContainerPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CONTAINER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.container.root)
  async findContainers(
    @Query(
      new DirectFilterPipe<any, Prisma.ContainerWhereInput>([
        ContainerScalarFieldEnum.id,
        ContainerScalarFieldEnum.idTos,
        ContainerScalarFieldEnum.idCont,
        ContainerScalarFieldEnum.vesselKey,
        ContainerScalarFieldEnum.vesselImvoy,
        ContainerScalarFieldEnum.vesselExvoy,
        ContainerScalarFieldEnum.eta,
        ContainerScalarFieldEnum.etb,
        ContainerScalarFieldEnum.etd,
        ContainerScalarFieldEnum.bargeInKey,
        ContainerScalarFieldEnum.bargeOutKey,
        ContainerScalarFieldEnum.deliveryOrder,
        ContainerScalarFieldEnum.blNo,
        ContainerScalarFieldEnum.bookingNo,
        ContainerScalarFieldEnum.houseBillNo,
        ContainerScalarFieldEnum.containerNo,
        ContainerScalarFieldEnum.fe,
        ContainerScalarFieldEnum.containerStatusCode,
        ContainerScalarFieldEnum.cargoTypeCode,
        ContainerScalarFieldEnum.localSizeType,
        ContainerScalarFieldEnum.isoSizeType,
        ContainerScalarFieldEnum.isLocalForeign,
        ContainerScalarFieldEnum.jobModeCodeIn,
        ContainerScalarFieldEnum.jobModeCodeOut,
        ContainerScalarFieldEnum.methodCodeIn,
        ContainerScalarFieldEnum.methodCodeOut,
        ContainerScalarFieldEnum.dateIn,
        ContainerScalarFieldEnum.dateOut,
        ContainerScalarFieldEnum.requireSurveyDate,
        ContainerScalarFieldEnum.repairMoveDate,
        ContainerScalarFieldEnum.eirInNo,
        ContainerScalarFieldEnum.eirOutNo,
        ContainerScalarFieldEnum.stuffNo,
        ContainerScalarFieldEnum.unstuffNo,
        ContainerScalarFieldEnum.serviceNo,
        ContainerScalarFieldEnum.draftNo,
        ContainerScalarFieldEnum.invoiceNo,
        ContainerScalarFieldEnum.zoneCode,
        ContainerScalarFieldEnum.yardCode,
        ContainerScalarFieldEnum.lineCode,
        ContainerScalarFieldEnum.block,
        ContainerScalarFieldEnum.bay,
        ContainerScalarFieldEnum.row,
        ContainerScalarFieldEnum.tier,
        ContainerScalarFieldEnum.area,
        ContainerScalarFieldEnum.vgm,
        ContainerScalarFieldEnum.mcWeight,
        ContainerScalarFieldEnum.tareWeight,
        ContainerScalarFieldEnum.maxGrossWeight,
        ContainerScalarFieldEnum.sealNo,
        ContainerScalarFieldEnum.sealNo1,
        ContainerScalarFieldEnum.sealNo2,
        ContainerScalarFieldEnum.pol,
        ContainerScalarFieldEnum.pod,
        ContainerScalarFieldEnum.fpod,
        ContainerScalarFieldEnum.transitCode,
        ContainerScalarFieldEnum.transitPort,
        ContainerScalarFieldEnum.temperature,
        ContainerScalarFieldEnum.vent,
        ContainerScalarFieldEnum.ventUnit,
        ContainerScalarFieldEnum.cusHold,
        ContainerScalarFieldEnum.terHold,
        ContainerScalarFieldEnum.isSpecialWarning,
        ContainerScalarFieldEnum.conditionCode,
        ContainerScalarFieldEnum.classifyCode,
        ContainerScalarFieldEnum.conditionMachineCode,
        ContainerScalarFieldEnum.isTruckBarge,
        ContainerScalarFieldEnum.truckNo,
        ContainerScalarFieldEnum.romoocNo,
        ContainerScalarFieldEnum.isBundled,
        ContainerScalarFieldEnum.containerNoMaster,
      ]),
    )
    queryParams: FindContainersRequestDto,
  ): Promise<ContainerPaginatedResponseDto> {
    const query = new FindContainersQuery(queryParams.findOptions);
    const result: FindContainersQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ContainerPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
