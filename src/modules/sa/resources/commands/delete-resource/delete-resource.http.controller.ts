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
import { DeleteResourceCommand } from './delete-resource.command';
import { DeleteResourceCommandResult } from './delete-resource.service';
import { match } from 'oxide.ts';
import { ResourceNotFoundError } from '../../domain/resource.error';

@Controller(routesV1.version)
export class DeleteResourceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.RESOURCE.parent} - ${resourcesV1.RESOURCE.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Resource' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'resource Id',
    type: 'string',
    required: true,
    example: '',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Resource deleted',
  })
  @AuthPermission(resourcesV1.RESOURCE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.sa.resource.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') resourceId: string): Promise<boolean> {
    const command = new DeleteResourceCommand({ resourceId });
    const result: DeleteResourceCommandResult = await this.commandBus.execute(
      command,
    );
    return match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ResourceNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }

        throw error;
      },
    });
  }
}
