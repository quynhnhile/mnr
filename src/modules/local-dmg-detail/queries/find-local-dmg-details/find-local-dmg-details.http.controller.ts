import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocalDmgDetailPaginatedResponseDto } from '@modules/local-dmg-detail/dtos/local-dmg-detail.paginated.response.dto';
import { LocalDmgDetailMapper } from '@modules/local-dmg-detail/mappers/local-dmg-detail.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindLocalDmgDetailsQuery,
  FindLocalDmgDetailsQueryResult,
} from './find-local-dmg-details.query-handler';
import { FindLocalDmgDetailsRequestDto } from './find-local-dmg-details.request.dto';
import { Prisma } from '@prisma/client';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { LocalDmgDetailScalarFieldEnum } from '../../database/local-dmg-detail.repository.prisma';

@Controller(routesV1.version)
export class FindLocalDmgDetailsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: LocalDmgDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCAL_DMG_DETAIL.parent} - ${resourcesV1.LOCAL_DMG_DETAIL.displayName}`,
  )
  @ApiOperation({ summary: 'Find LocalDmgDetails' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocalDmgDetailPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.LOCAL_DMG_DETAIL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.localDmgDetail.root)
  async findLocalDmgDetails(
    @Query(
      new DirectFilterPipe<any, Prisma.LocalDmgDetailWhereInput>([
        LocalDmgDetailScalarFieldEnum.id,
        LocalDmgDetailScalarFieldEnum.idSurvey,
        LocalDmgDetailScalarFieldEnum.idCont,
        LocalDmgDetailScalarFieldEnum.damLocalCode,
        LocalDmgDetailScalarFieldEnum.locLocalCode,
        LocalDmgDetailScalarFieldEnum.symbolCode,
        LocalDmgDetailScalarFieldEnum.size,
      ]),
    )
    queryParams: FindLocalDmgDetailsRequestDto,
  ): Promise<LocalDmgDetailPaginatedResponseDto> {
    const query = new FindLocalDmgDetailsQuery(queryParams.findOptions);
    const result: FindLocalDmgDetailsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new LocalDmgDetailPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
