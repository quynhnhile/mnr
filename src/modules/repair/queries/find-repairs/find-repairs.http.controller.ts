import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairScalarFieldEnum } from '@modules/repair/database/repair.repository.prisma';
import { RepairPaginatedResponseDto } from '@modules/repair/dtos/repair.paginated.response.dto';
import { RepairMapper } from '@modules/repair/mappers/repair.mapper';
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
  FindRepairsQuery,
  FindRepairsQueryResult,
} from './find-repairs.query-handler';
import { FindRepairsRequestDto } from './find-repairs.request.dto';

@Controller(routesV1.version)
export class FindRepairsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairMapper,
  ) {}

  @ApiTags(`${resourcesV1.REPAIR.parent} - ${resourcesV1.REPAIR.displayName}`)
  @ApiOperation({ summary: 'Find Repairs' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindRepairsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindRepairsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RepairPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.REPAIR.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.repair.root)
  async findRepairs(
    @Query(
      new DirectFilterPipe<any, Prisma.RepairWhereInput>([
        RepairScalarFieldEnum.id,
        RepairScalarFieldEnum.operationCode,
        RepairScalarFieldEnum.repCode,
        RepairScalarFieldEnum.repNameEn,
        RepairScalarFieldEnum.repNameVi,
        RepairScalarFieldEnum.isClean,
        RepairScalarFieldEnum.isRepair,
        RepairScalarFieldEnum.isPti,
      ]),
    )
    queryParams: FindRepairsRequestDto,
  ): Promise<RepairPaginatedResponseDto> {
    const query = new FindRepairsQuery(queryParams.findOptions);
    const result: FindRepairsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new RepairPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
