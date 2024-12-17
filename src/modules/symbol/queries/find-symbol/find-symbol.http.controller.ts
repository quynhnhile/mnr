import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SymbolNotFoundError } from '@modules/symbol/domain/symbol.error';
import { SymbolResponseDto } from '@modules/symbol/dtos/symbol.response.dto';
import { SymbolMapper } from '@modules/symbol/mappers/symbol.mapper';
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
  FindSymbolQuery,
  FindSymbolQueryResult,
} from './find-symbol.query-handler';

@Controller(routesV1.version)
export class FindSymbolHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SymbolMapper,
  ) {}

  @ApiTags(`${resourcesV1.SYMBOL.parent} - ${resourcesV1.SYMBOL.displayName}`)
  @ApiOperation({ summary: 'Find one Symbol' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Symbol ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SymbolResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SymbolNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYMBOL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.symbol.getOne)
  async findSymbol(@Param('id') symbolId: bigint): Promise<SymbolResponseDto> {
    const query = new FindSymbolQuery(symbolId);
    const result: FindSymbolQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (symbol) => this.mapper.toResponse(symbol),
      Err: (error) => {
        if (error instanceof SymbolNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
