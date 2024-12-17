import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  PayerCodeAlreadyInUseError,
  PayerNotFoundError,
} from '@modules/payer/domain/payer.error';
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
import { DeletePayerCommand } from './delete-payer.command';
import { DeletePayerCommandResult } from './delete-payer.service';

@Controller(routesV1.version)
export class DeletePayerHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.PAYER.parent} - ${resourcesV1.PAYER.displayName}`)
  @ApiOperation({ summary: 'Delete a Payer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Payer ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Payer deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PayerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PayerCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.PAYER.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.payer.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') payerId: bigint): Promise<void> {
    const command = new DeletePayerCommand({ payerId });
    const result: DeletePayerCommandResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof PayerNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof PayerCodeAlreadyInUseError) {
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
