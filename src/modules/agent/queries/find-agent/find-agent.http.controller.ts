import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { AgentNotFoundError } from '@modules/agent/domain/agent.error';
import { AgentResponseDto } from '@modules/agent/dtos/agent.response.dto';
import { AgentMapper } from '@modules/agent/mappers/agent.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindAgentQuery,
  FindAgentQueryResult,
} from './find-agent.query-handler';

@Controller(routesV1.version)
export class FindAgentHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: AgentMapper,
  ) {}

  @ApiTags(`${resourcesV1.AGENT.parent} - ${resourcesV1.AGENT.displayName}`)
  @ApiOperation({ summary: 'Find one Agent' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Agent ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AgentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AgentNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.AGENT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.agent.getOne)
  async findAgent(@Param('id') agentId: bigint): Promise<AgentResponseDto> {
    const query = new FindAgentQuery(agentId);
    const result: FindAgentQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (agent) => this.mapper.toResponse(agent),
      Err: (error) => {
        if (error instanceof AgentNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
