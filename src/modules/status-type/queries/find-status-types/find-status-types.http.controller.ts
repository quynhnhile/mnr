import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { StatusTypePaginatedResponseDto } from '@modules/status-type/dtos/status-type.paginated.response.dto';
import { StatusTypeMapper } from '@modules/status-type/mappers/status-type.mapper';
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
import {
  FindStatusTypesQuery,
  FindStatusTypesQueryResult,
} from './find-status-types.query-handler';
import { FindStatusTypesRequestDto } from './find-status-types.request.dto';
import { Prisma } from '@prisma/client';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { StatusTypeScalarFieldEnum } from '../../database/status-type.repository.prisma';

@Controller(routesV1.version)
export class FindStatusTypesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: StatusTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.STATUS_TYPE.parent} - ${resourcesV1.STATUS_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Find StatusTypes' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindStatusTypesRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindStatusTypesRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusTypePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.STATUS_TYPE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.statusType.root)
  async findStatusTypes(
    @Query(
      new DirectFilterPipe<any, Prisma.StatusTypeWhereInput>([
        StatusTypeScalarFieldEnum.id,
        StatusTypeScalarFieldEnum.statusTypeCode,
        StatusTypeScalarFieldEnum.statusTypeName,
      ]),
    )
    queryParams: FindStatusTypesRequestDto,
  ): Promise<StatusTypePaginatedResponseDto> {
    const query = new FindStatusTypesQuery(queryParams.findOptions);
    const result: FindStatusTypesQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new StatusTypePaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
