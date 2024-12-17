import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SysConfigOprNotFoundError } from '@modules/sys-config-opr/domain/sys-config-opr.error';
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
import { DeleteSysConfigOprCommand } from './delete-sys-config-opr.command';
import { DeleteSysConfigOprServiceResult } from './delete-sys-config-opr.service';

@Controller(routesV1.version)
export class DeleteSysConfigOprHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.SYS_CONFIG_OPR.parent} - ${resourcesV1.SYS_CONFIG_OPR.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a SysConfigOpr' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'SysConfigOpr ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'SysConfigOpr deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SysConfigOprNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYS_CONFIG_OPR.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.sysConfigOpr.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') sysConfigOprId: bigint): Promise<void> {
    const command = new DeleteSysConfigOprCommand({ sysConfigOprId });
    const result: DeleteSysConfigOprServiceResult = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof SysConfigOprNotFoundError) {
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
