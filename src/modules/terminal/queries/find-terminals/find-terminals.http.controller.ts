import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TerminalScalarFieldEnum } from '@modules/terminal/database/terminal.repository.prisma';
import { TerminalPaginatedResponseDto } from '@modules/terminal/dtos/terminal.paginated.response.dto';
import { TerminalMapper } from '@modules/terminal/mappers/terminal.mapper';
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
  FindTerminalsQuery,
  FindTerminalsQueryResult,
} from './find-terminals.query-handler';
import { FindTerminalsRequestDto } from './find-terminals.request.dto';

@Controller(routesV1.version)
export class FindTerminalsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TerminalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TERMINAL.parent} - ${resourcesV1.TERMINAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find Terminals' })
  @ApiQuery({
    type: FilterDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FilterDto),
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TerminalPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.TERMINAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.terminal.root)
  async findTerminals(
    @Query(
      new DirectFilterPipe<any, Prisma.TerminalWhereInput>([
        TerminalScalarFieldEnum.id,
        TerminalScalarFieldEnum.regionCode,
        TerminalScalarFieldEnum.terminalCode,
        TerminalScalarFieldEnum.terminalName,
        TerminalScalarFieldEnum.terminalNameEng,
        TerminalScalarFieldEnum.vat,
        TerminalScalarFieldEnum.email,
        TerminalScalarFieldEnum.tel,
        TerminalScalarFieldEnum.fax,
        TerminalScalarFieldEnum.web,
        TerminalScalarFieldEnum.hotlineInfo,
        TerminalScalarFieldEnum.contactTel,
        TerminalScalarFieldEnum.contactZaloId,
        TerminalScalarFieldEnum.contactFbId,
        TerminalScalarFieldEnum.contactEmail,
        TerminalScalarFieldEnum.isActive,
      ]),
    )
    queryParams: FindTerminalsRequestDto,
  ): Promise<any> {
    const query = new FindTerminalsQuery(queryParams.findOptions);
    const result: FindTerminalsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new TerminalPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
