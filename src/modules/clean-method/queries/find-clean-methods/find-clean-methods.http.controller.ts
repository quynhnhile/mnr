import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanMethodScalarFieldEnum } from '@modules/clean-method/database/clean-method.repository.prisma';
import { CleanMethodPaginatedResponseDto } from '@modules/clean-method/dtos/clean-method.paginated.response.dto';
import { CleanMethodMapper } from '@modules/clean-method/mappers/clean-method.mapper';
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
  FindCleanMethodsQuery,
  FindCleanMethodsQueryResult,
} from './find-clean-methods.query-handler';
import { FindCleanMethodsRequestDto } from './find-clean-methods.request.dto';

@Controller(routesV1.version)
export class FindCleanMethodsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CleanMethodMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_METHOD.parent} - ${resourcesV1.CLEAN_METHOD.displayName}`,
  )
  @ApiOperation({ summary: 'Find CleanMethods' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindCleanMethodsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindCleanMethodsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CleanMethodPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CLEAN_METHOD.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.cleanMethod.root)
  async findCleanMethods(
    @Query(
      new DirectFilterPipe<any, Prisma.CleanMethodWhereInput>([
        CleanMethodScalarFieldEnum.id,
        CleanMethodScalarFieldEnum.operationCode,
        CleanMethodScalarFieldEnum.cleanMethodCode,
        CleanMethodScalarFieldEnum.cleanMethodName,
      ]),
    )
    queryParams: FindCleanMethodsRequestDto,
  ): Promise<CleanMethodPaginatedResponseDto> {
    const query = new FindCleanMethodsQuery(queryParams.findOptions);
    const result: FindCleanMethodsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new CleanMethodPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
