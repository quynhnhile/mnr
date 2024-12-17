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
import { DeleteUserCommand } from './delete-user.command';
import { DeleteUserCommandResult } from './delete-user.service';
import { match } from 'oxide.ts';
import { UserNotFoundError } from '../../domain/user.error';

@Controller(routesV1.version)
export class DeleteUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.USER.parent} - ${resourcesV1.USER.displayName}`)
  @ApiOperation({ summary: 'Delete an user' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'User Id',
    type: 'string',
    required: true,
    example: '',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted',
  })
  @AuthPermission(resourcesV1.USER.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.sa.user.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') userId: string): Promise<boolean> {
    const command = new DeleteUserCommand({ userId });
    const result: DeleteUserCommandResult = await this.commandBus.execute(
      command,
    );
    return match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof UserNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }

        throw error;
      },
    });
  }
}
