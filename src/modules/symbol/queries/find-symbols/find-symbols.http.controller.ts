import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SymbolPaginatedResponseDto } from '@modules/symbol/dtos/symbol.paginated.response.dto';
import { SymbolMapper } from '@modules/symbol/mappers/symbol.mapper';
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
  FindSymbolsQuery,
  FindSymbolsQueryResult,
} from './find-symbols.query-handler';
import { FindSymbolsRequestDto } from './find-symbols.request.dto';
import { SymbolScalarFieldEnum } from '../../database/symbol.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';

@Controller(routesV1.version)
export class FindSymbolsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SymbolMapper,
  ) {}

  @ApiTags(`${resourcesV1.SYMBOL.parent} - ${resourcesV1.SYMBOL.displayName}`)
  @ApiOperation({ summary: 'Find Symbols' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindSymbolsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindSymbolsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SymbolPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.SYMBOL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.symbol.root)
  async findSymbols(
    @Query(
      new DirectFilterPipe<any, Prisma.SymbolWhereInput>([
        SymbolScalarFieldEnum.id,
        SymbolScalarFieldEnum.symbolCode,
      ]),
    )
    queryParams: FindSymbolsRequestDto,
  ): Promise<SymbolPaginatedResponseDto> {
    const query = new FindSymbolsQuery(queryParams.findOptions);
    const result: FindSymbolsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new SymbolPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
