import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { MnrOverNotFoundError } from '@modules/mnr-over/domain/mnr-over.error';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
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
import { DeleteMnrOverCommand } from './delete-mnr-over.command';
import { DeleteMnrOverServiceResult } from './delete-mnr-over.service';

@Controller(routesV1.version)
export class DeleteMnrOverHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.MNR_OVER.parent} - ${resourcesV1.MNR_OVER.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a MnrOver' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'MnrOver ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'MnrOver deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MnrOverNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.MNR_OVER.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.mnrOver.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') mnrOverId: bigint): Promise<void> {
    const command = new DeleteMnrOverCommand({ mnrOverId });
    const result: DeleteMnrOverServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof MnrOverNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
