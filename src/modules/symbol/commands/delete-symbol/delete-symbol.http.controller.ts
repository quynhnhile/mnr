import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  SymbolCodeAlreadyInUseError,
  SymbolNotFoundError,
} from '@modules/symbol/domain/symbol.error';
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
import { DeleteSymbolCommand } from './delete-symbol.command';
import { DeleteSymbolServiceResult } from './delete-symbol.service';

@Controller(routesV1.version)
export class DeleteSymbolHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.SYMBOL.parent} - ${resourcesV1.SYMBOL.displayName}`)
  @ApiOperation({ summary: 'Delete a Symbol' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Symbol ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Symbol deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SymbolNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SymbolCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYMBOL.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.symbol.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') symbolId: bigint): Promise<void> {
    const command = new DeleteSymbolCommand({ symbolId });
    const result: DeleteSymbolServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof SymbolNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof SymbolCodeAlreadyInUseError) {
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
