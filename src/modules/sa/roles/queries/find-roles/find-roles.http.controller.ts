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
  FindRolesQueryHandler,
  FindRolesQuery,
} from './find-roles.query-handler';
import { RolePaginatedResponseDto } from '../../dtos/role.paginated.response.dto';
import { RoleResponseDto } from '../../dtos/role.response.dto';

@Controller(routesV1.version)
export class FindRolesHttpController {
  constructor(private readonly findRoleQueryHandler: FindRolesQueryHandler) {}

  @ApiTags(`${resourcesV1.ROLE.parent} - ${resourcesV1.ROLE.displayName}`)
  @ApiOperation({ summary: 'Find Roles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RolePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.ROLE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.role.root)
  async findRoles(): Promise<RoleResponseDto[]> {
    new FindRolesQuery();
    return await this.findRoleQueryHandler.execute();
  }
}
