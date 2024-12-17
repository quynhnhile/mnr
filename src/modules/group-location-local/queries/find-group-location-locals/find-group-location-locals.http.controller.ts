import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { GroupLocationLocalPaginatedResponseDto } from '@modules/group-location-local/dtos/group-location-local.paginated.response.dto';
import { GroupLocationLocalMapper } from '@modules/group-location-local/mappers/group-location-local.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindGroupLocationLocalsQuery,
  FindGroupLocationLocalsQueryResult,
} from './find-group-location-locals.query-handler';
import { FindGroupLocationLocalsRequestDto } from './find-group-location-locals.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { GroupLocationLocalScalarFieldEnum } from '../../database/group-location-local.repository.prisma';

@Controller(routesV1.version)
export class FindGroupLocationLocalsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: GroupLocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.GROUP_LOCATION_LOCAL.parent} - ${resourcesV1.GROUP_LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find GroupLocationLocals' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GroupLocationLocalPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.GROUP_LOCATION_LOCAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.groupLocationLocal.root)
  async findGroupLocationLocals(
    @Query(
      new DirectFilterPipe<any, Prisma.GroupLocationLocalWhereInput>([
        GroupLocationLocalScalarFieldEnum.id,
        GroupLocationLocalScalarFieldEnum.groupLocLocalCode,
        GroupLocationLocalScalarFieldEnum.groupLocLocalName,
        GroupLocationLocalScalarFieldEnum.contType,
      ]),
    )
    queryParams: FindGroupLocationLocalsRequestDto,
  ): Promise<GroupLocationLocalPaginatedResponseDto> {
    const query = new FindGroupLocationLocalsQuery(queryParams.findOptions);
    const result: FindGroupLocationLocalsQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new GroupLocationLocalPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
