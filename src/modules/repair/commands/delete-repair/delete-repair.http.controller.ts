import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  RepairCodeAlreadyInUseError,
  RepairNotFoundError,
} from '@modules/repair/domain/repair.error';
import {
  BadRequestException,
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
import { DeleteRepairCommand } from './delete-repair.command';
import { DeleteRepairServiceResult } from './delete-repair.service';

@Controller(routesV1.version)
export class DeleteRepairHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.REPAIR.parent} - ${resourcesV1.REPAIR.displayName}`)
  @ApiOperation({ summary: 'Delete a Repair' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Repair ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Repair deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RepairNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RepairCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REPAIR.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.repair.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') repairId: bigint): Promise<void> {
    const command = new DeleteRepairCommand({ repairId });
    const result: DeleteRepairServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof RepairNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof RepairCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
