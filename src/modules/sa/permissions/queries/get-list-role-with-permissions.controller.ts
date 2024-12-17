import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { GetListRoleWithPermissionsQueryHandler } from './get-list-role-with-permissions.query-handler';
import { ResourceResponseDto } from '../../resources/dtos/resource.response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { resourcesV1, resourceScopes } from '@src/configs/app.permission';
import { routesV1 } from '@src/configs/app.routes';
import { AuthPermission } from '@src/libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@src/modules/auth/guards';

@Controller(routesV1.version)
export class GetListRoleWithPermissionsController {
  constructor(
    private readonly getListRoleWithPermissionsQueryHandler: GetListRoleWithPermissionsQueryHandler,
  ) {}
  @ApiTags(
    `${resourcesV1.PERMISSION.parent} - ${resourcesV1.PERMISSION.displayName}`,
  )
  @ApiOperation({ summary: 'Get list role with permissions' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'roleName',
    description: 'Role name',
    type: 'string',
    required: true,
    example: '',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResourceResponseDto,
  })
  @AuthPermission(resourcesV1.PERMISSION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.permission.getOne)
  async getPermissionsByRole(
    @Param('roleName') roleName: string,
  ): Promise<ResourceResponseDto[]> {
    const result = await this.getListRoleWithPermissionsQueryHandler.execute(
      roleName,
    );
    return result.map((resource) => new ResourceResponseDto(resource));
  }
}
