import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TerminalNotFoundError } from '@modules/terminal/domain/terminal.error';
import { TerminalResponseDto } from '@modules/terminal/dtos/terminal.response.dto';
import { TerminalMapper } from '@modules/terminal/mappers/terminal.mapper';
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
  FindTerminalQuery,
  FindTerminalQueryResult,
} from './find-terminal.query-handler';

@Controller(routesV1.version)
export class FindTerminalHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TerminalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TERMINAL.parent} - ${resourcesV1.TERMINAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Terminal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Terminal ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TerminalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TerminalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TERMINAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.terminal.getOne)
  async findTerminal(
    @Param('id') terminalId: bigint,
  ): Promise<TerminalResponseDto> {
    const query = new FindTerminalQuery(terminalId);
    const result: FindTerminalQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (terminal) => this.mapper.toResponse(terminal),
      Err: (error) => {
        if (error instanceof TerminalNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
