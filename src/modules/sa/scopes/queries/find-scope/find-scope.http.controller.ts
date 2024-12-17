import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  NotFoundException as NotFoundHttpException,
  Controller,
  Get,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindScopeQuery,
  FindScopeQueryHandler,
} from './find-scope.query-handler';
import { ScopeResponseDto } from '../../dtos/scope.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { match } from 'oxide.ts';
import { ScopeNotFoundError } from '../../domain/scope.error';

@Controller(routesV1.version)
export class FindScopeHttpController {
  constructor(private readonly findScopeQueryHandler: FindScopeQueryHandler) {}

  @ApiTags(`${resourcesV1.SCOPE.parent} - ${resourcesV1.SCOPE.displayName}`)
  @ApiOperation({ summary: 'Find one scope' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Scope id',
    type: 'string',
    required: true,
    example: 'e15f07fc-a6a3-406e-8057-56eb280375a0',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ScopeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ScopeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SCOPE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.scope.getOne)
  async findRole(@Param('id') scopeId: string): Promise<ScopeResponseDto> {
    const query = new FindScopeQuery(scopeId);
    const result = await this.findScopeQueryHandler.execute(query);

    return match(result, {
      Ok: (scopeResponseDto: ScopeResponseDto) => {
        return scopeResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof ScopeNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
