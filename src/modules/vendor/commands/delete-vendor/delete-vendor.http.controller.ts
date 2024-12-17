import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  VendorCodeAlreadyInUseError,
  VendorNotFoundError,
} from '@modules/vendor/domain/vendor.error';
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
import { DeleteVendorCommand } from './delete-vendor.command';
import { DeleteVendorCommandResult } from './delete-vendor.service';

@Controller(routesV1.version)
export class DeleteVendorHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.VENDOR.parent} - ${resourcesV1.VENDOR.displayName}`)
  @ApiOperation({ summary: 'Delete a Vendor' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Vendor ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Vendor deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: VendorNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: VendorCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.vendor.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') vendorId: bigint): Promise<void> {
    const command = new DeleteVendorCommand({ vendorId });
    const result: DeleteVendorCommandResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof VendorNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof VendorCodeAlreadyInUseError) {
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
