import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  NotFoundException as NotFoundHttpException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
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
import { DeleteRoleCommand } from './delete-role.command';
import { DeleteRoleCommandResult } from './delete-role.service';
import { match } from 'oxide.ts';
import { RoleNotFoundError } from '../../domain/role.error';

@Controller(routesV1.version)
export class DeleteRoleHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.ROLE.parent} - ${resourcesV1.ROLE.displayName}`)
  @ApiOperation({ summary: 'Delete a Role' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'roleName',
    description: 'Role Name',
    type: 'string',
    required: true,
    example: 'ECM_test',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Role deleted',
  })
  @AuthPermission(resourcesV1.ROLE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.sa.role.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('roleName') roleName: string): Promise<boolean> {
    const command = new DeleteRoleCommand({ roleName });
    const result: DeleteRoleCommandResult = await this.commandBus.execute(
      command,
    );
    return match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof RoleNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }

        throw error;
      },
    });
  }
}
