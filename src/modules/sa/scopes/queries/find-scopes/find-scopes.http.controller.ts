import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindScopesQueryHandler,
  FindScopesQuery,
} from './find-scopes.query-handler';
import { ScopePaginatedResponseDto } from '../../dtos/scope.paginated.response.dto';
import { ScopeResponseDto } from '../../dtos/scope.response.dto';

@Controller(routesV1.version)
export class FindScopesHttpController {
  constructor(private readonly findScopeQueryHandler: FindScopesQueryHandler) {}

  @ApiTags(`${resourcesV1.SCOPE.parent} - ${resourcesV1.SCOPE.displayName}`)
  @ApiOperation({ summary: 'Find Scopes' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ScopePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.SCOPE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.scope.root)
  async findScopes(): Promise<ScopeResponseDto[]> {
    new FindScopesQuery();
    return await this.findScopeQueryHandler.execute();
  }
}
