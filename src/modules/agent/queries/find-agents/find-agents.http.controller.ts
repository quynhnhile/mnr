import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { AgentPaginatedResponseDto } from '@modules/agent/dtos/agent.paginated.response.dto';
import { AgentMapper } from '@modules/agent/mappers/agent.mapper';
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
  FindAgentsQuery,
  FindAgentsQueryResult,
} from './find-agents.query-handler';
import { FindAgentsRequestDto } from './find-agents.request.dto';
import { Prisma } from '@prisma/client';
import { AgentScalarFieldEnum } from '../../database/agent.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';

@Controller(routesV1.version)
export class FindAgentsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: AgentMapper,
  ) {}

  @ApiTags(`${resourcesV1.AGENT.parent} - ${resourcesV1.AGENT.displayName}`)
  @ApiOperation({ summary: 'Find Agents' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindAgentsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindAgentsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AgentPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.AGENT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.agent.root)
  async findAgents(
    @Query(
      new DirectFilterPipe<any, Prisma.AgentWhereInput>([
        AgentScalarFieldEnum.id,
        AgentScalarFieldEnum.operationCode,
        AgentScalarFieldEnum.agentCode,
        AgentScalarFieldEnum.agentName,
      ]),
    )
    queryParams: FindAgentsRequestDto,
  ): Promise<AgentPaginatedResponseDto> {
    const query = new FindAgentsQuery(queryParams.findOptions);
    const result: FindAgentsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new AgentPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
