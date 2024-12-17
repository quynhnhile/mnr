import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { AgentNotFoundError } from '@modules/agent/domain/agent.error';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
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
import { DeleteAgentCommand } from './delete-agent.command';
import { DeleteAgentServiceResult } from './delete-agent.service';

@Controller(routesV1.version)
export class DeleteAgentHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.AGENT.parent} - ${resourcesV1.AGENT.displayName}`)
  @ApiOperation({ summary: 'Delete a Agent' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Agent ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Agent deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AgentNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.AGENT.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.agent.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') agentId: bigint): Promise<void> {
    const command = new DeleteAgentCommand({ agentId });
    const result: DeleteAgentServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof AgentNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
