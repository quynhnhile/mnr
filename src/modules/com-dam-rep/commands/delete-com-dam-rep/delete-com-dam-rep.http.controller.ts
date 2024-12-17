import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComDamRepNotFoundError } from '@modules/com-dam-rep/domain/com-dam-rep.error';
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
import { DeleteComDamRepCommand } from './delete-com-dam-rep.command';
import { DeleteComDamRepServiceResult } from './delete-com-dam-rep.service';

@Controller(routesV1.version)
export class DeleteComDamRepHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.COM_DAM_REP.parent} - ${resourcesV1.COM_DAM_REP.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a ComDamRep' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ComDamRep ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'ComDamRep deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ComDamRepNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COM_DAM_REP.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.comDamRep.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') comDamRepId: bigint): Promise<void> {
    const command = new DeleteComDamRepCommand({ comDamRepId });
    const result: DeleteComDamRepServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ComDamRepNotFoundError) {
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
