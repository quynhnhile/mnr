import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { AgentEntity } from '@modules/agent/domain/agent.entity';
import {
  AgentCodeAlreadyExistsError,
  AgentNotFoundError,
} from '@modules/agent/domain/agent.error';
import { AgentResponseDto } from '@modules/agent/dtos/agent.response.dto';
import { AgentMapper } from '@modules/agent/mappers/agent.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  ConflictException as ConflictHttpException,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateAgentCommand } from './update-agent.command';
import { UpdateAgentRequestDto } from './update-agent.request.dto';
import { UpdateAgentServiceResult } from './update-agent.service';

@Controller(routesV1.version)
export class UpdateAgentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: AgentMapper,
  ) {}

  @ApiTags(`${resourcesV1.AGENT.parent} - ${resourcesV1.AGENT.displayName}`)
  @ApiOperation({ summary: 'Update a Agent' })
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.AGENT.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.agent.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') agentId: bigint,
    @Body() body: UpdateAgentRequestDto,
  ): Promise<AgentResponseDto> {
    const command = new UpdateAgentCommand({
      agentId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateAgentServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (agent: AgentEntity) => this.mapper.toResponse(agent),
      Err: (error: Error) => {
        if (error instanceof AgentNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof AgentCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
