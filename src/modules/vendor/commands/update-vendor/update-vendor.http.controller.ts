import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { VendorEntity } from '@modules/vendor/domain/vendor.entity';
import {
  VendorCodeAlreadyExistsError,
  VendorCodeAlreadyInUseError,
  VendorNotFoundError,
} from '@modules/vendor/domain/vendor.error';
import { VendorResponseDto } from '@modules/vendor/dtos/vendor.response.dto';
import { VendorMapper } from '@modules/vendor/mappers/vendor.mapper';
import {
  BadRequestException,
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
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
import { UpdateVendorCommand } from './update-vendor.command';
import { UpdateVendorRequestDto } from './update-vendor.request.dto';
import { UpdateVendorCommandResult } from './update-vendor.service';

@Controller(routesV1.version)
export class UpdateVendorHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: VendorMapper,
  ) {}

  @ApiTags(`${resourcesV1.VENDOR.parent} - ${resourcesV1.VENDOR.displayName}`)
  @ApiOperation({ summary: 'Update a Vendor' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Vendor ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VendorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${VendorNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: VendorCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: VendorCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.vendor.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') vendorId: bigint,
    @Body() body: UpdateVendorRequestDto,
  ): Promise<VendorResponseDto> {
    const command = new UpdateVendorCommand({
      vendorId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateVendorCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (vendor: VendorEntity) => this.mapper.toResponse(vendor),
      Err: (error: Error) => {
        if (
          error instanceof VendorNotFoundError ||
          error instanceof OperationNotFoundError
        ) {
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
        if (error instanceof VendorCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
