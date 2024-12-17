import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  VendorTypeCodeAlreadyInUseError,
  VendorTypeNotFoundError,
} from '@modules/vendor-type/domain/vendor-type.error';
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
import { DeleteVendorTypeCommand } from './delete-vendor-type.command';
import { DeleteVendorTypeCommandResult } from './delete-vendor-type.service';

@Controller(routesV1.version)
export class DeleteVendorTypeHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.VENDOR_TYPE.parent} - ${resourcesV1.VENDOR_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a VendorType' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'VendorType ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'VendorType deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: VendorTypeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: VendorTypeCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR_TYPE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.vendorType.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') vendorTypeId: bigint): Promise<void> {
    const command = new DeleteVendorTypeCommand({ vendorTypeId });
    const result: DeleteVendorTypeCommandResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof VendorTypeNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof VendorTypeCodeAlreadyInUseError) {
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
