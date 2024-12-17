import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import { AgentResponseDto } from '@modules/agent/dtos/agent.response.dto';
import { AgentMapper } from '@modules/agent/mappers/agent.mapper';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAgentCommand } from './create-agent.command';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentServiceResult } from './create-agent.service';

@Controller(routesV1.version)
export class CreateAgentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: AgentMapper,
  ) {}

  @ApiTags(`${resourcesV1.AGENT.parent} - ${resourcesV1.AGENT.displayName}`)
  @ApiOperation({ summary: 'Create a Agent' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AgentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.AGENT.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.agent.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateAgentRequestDto,
  ): Promise<AgentResponseDto> {
    const command = new CreateAgentCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateAgentServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (agent: AgentEntity) => this.mapper.toResponse(agent),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
