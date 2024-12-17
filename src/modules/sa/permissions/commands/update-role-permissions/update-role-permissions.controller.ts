import {
  Body,
  Controller,
  HttpStatus,
  // Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateRolePermissionsRequestDto } from './update-role-permissions.request.dto';
import { routesV1 } from '@src/configs/app.routes';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  // ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { resourcesV1, resourceScopes } from '@src/configs/app.permission';
import { AuthPermission } from '@src/libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@src/modules/auth/guards';
import { RolePermissionResponseDto } from '../../dtos/role-permission.response.dto';
import { UpdateRolePermissionsService } from './update-role-permissions.service';

@Controller(routesV1.version)
export class UpdateRolePermissionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly updateRolePermission: UpdateRolePermissionsService,
  ) {}
  @ApiTags(
    `${resourcesV1.PERMISSION.parent} - ${resourcesV1.PERMISSION.displayName}`,
  )
  @ApiOperation({ summary: 'Update role permission' })
  @ApiBearerAuth()
  // @ApiParam({
  //   name: 'roleName',
  //   description: 'Role name',
  //   type: 'string',
  //   required: true,
  //   example: '',
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RolePermissionResponseDto,
  })
  @AuthPermission(resourcesV1.PERMISSION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.sa.permission.update)
  async updateRolePermissions(
    // @Param('roleName') roleName: string,
    @Body() body: UpdateRolePermissionsRequestDto,
  ): Promise<{
    failedResults: any[];
  }> {
    const { resources = [] } = body;
    const results = await Promise.allSettled(
      resources.map(
        async (resource) =>
          await this.updateRolePermission.execute({
            ...resource,
            // roleName: roleName,
          }),
      ),
    );

    const failedResults: any[] = [];
    results.forEach((result) => {
      if (result.status === 'rejected') {
        failedResults.push(result.reason.message);
      }
    });

    return { failedResults };
  }
}
