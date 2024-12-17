import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SysConfigOprPaginatedResponseDto } from '@modules/sys-config-opr/dtos/sys-config-opr.paginated.response.dto';
import { SysConfigOprMapper } from '@modules/sys-config-opr/mappers/sys-config-opr.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindSysConfigOprsQuery,
  FindSysConfigOprsQueryResult,
} from './find-sys-config-oprs.query-handler';
import { FindSysConfigOprsRequestDto } from './find-sys-config-oprs.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { SysConfigOprScalarFieldEnum } from '../../database/sys-config-opr.repository.prisma';

@Controller(routesV1.version)
export class FindSysConfigOprsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SysConfigOprMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SYS_CONFIG_OPR.parent} - ${resourcesV1.SYS_CONFIG_OPR.displayName}`,
  )
  @ApiOperation({ summary: 'Find SysConfigOprs' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SysConfigOprPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.SYS_CONFIG_OPR.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sysConfigOpr.root)
  async findSysConfigOprs(
    @Query(
      new DirectFilterPipe<any, Prisma.SysConfigOprWhereInput>([
        SysConfigOprScalarFieldEnum.id,
        SysConfigOprScalarFieldEnum.operationCode,
        SysConfigOprScalarFieldEnum.policyInfo,
        SysConfigOprScalarFieldEnum.discountRate,
        SysConfigOprScalarFieldEnum.amount,
      ]),
    )
    @Query()
    queryParams: FindSysConfigOprsRequestDto,
  ): Promise<SysConfigOprPaginatedResponseDto> {
    const query = new FindSysConfigOprsQuery(queryParams.findOptions);
    const result: FindSysConfigOprsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new SysConfigOprPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
