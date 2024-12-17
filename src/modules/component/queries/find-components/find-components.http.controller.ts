import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComponentScalarFieldEnum } from '@modules/component/database/component.repository.prisma';
import { ComponentPaginatedResponseDto } from '@modules/component/dtos/component.paginated.response.dto';
import { ComponentMapper } from '@modules/component/mappers/component.mapper';
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
  FindComponentsQuery,
  FindComponentsQueryResult,
} from './find-components.query-handler';
import { FindComponentsRequestDto } from './find-components.request.dto';

@Controller(routesV1.version)
export class FindComponentsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ComponentMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COMPONENT.parent} - ${resourcesV1.COMPONENT.displayName}`,
  )
  @ApiOperation({ summary: 'Find Components' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindComponentsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindComponentsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ComponentPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.COMPONENT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.component.root)
  async findComponents(
    @Query(
      new DirectFilterPipe<any, Prisma.ComponentWhereInput>([
        ComponentScalarFieldEnum.id,
        ComponentScalarFieldEnum.operationCode,
        ComponentScalarFieldEnum.compCode,
        ComponentScalarFieldEnum.compNameEn,
        ComponentScalarFieldEnum.compNameVi,
        ComponentScalarFieldEnum.assembly,
        ComponentScalarFieldEnum.side,
        ComponentScalarFieldEnum.contType,
        ComponentScalarFieldEnum.materialCode,
        ComponentScalarFieldEnum.isMachine,
      ]),
    )
    queryParams: FindComponentsRequestDto,
  ): Promise<ComponentPaginatedResponseDto> {
    const query = new FindComponentsQuery(queryParams.findOptions);
    const result: FindComponentsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ComponentPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
