import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import {
  VendorTypeCodeAlreadyExistsError,
  VendorTypeCodeAlreadyInUseError,
  VendorTypeNotFoundError,
} from '@modules/vendor-type/domain/vendor-type.error';
import { VendorTypeResponseDto } from '@modules/vendor-type/dtos/vendor-type.response.dto';
import { VendorTypeMapper } from '@modules/vendor-type/mappers/vendor-type.mapper';
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
import { UpdateVendorTypeCommand } from './update-vendor-type.command';
import { UpdateVendorTypeRequestDto } from './update-vendor-type.request.dto';
import { UpdateVendorTypeCommandResult } from './update-vendor-type.service';

@Controller(routesV1.version)
export class UpdateVendorTypeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: VendorTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.VENDOR_TYPE.parent} - ${resourcesV1.VENDOR_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Update a VendorType' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'VendorType ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VendorTypeResponseDto,
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
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: VendorTypeCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR_TYPE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.vendorType.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') vendorTypeId: bigint,
    @Body() body: UpdateVendorTypeRequestDto,
  ): Promise<VendorTypeResponseDto> {
    const command = new UpdateVendorTypeCommand({
      vendorTypeId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateVendorTypeCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (vendorType: VendorTypeEntity) => this.mapper.toResponse(vendorType),
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
        if (error instanceof VendorTypeCodeAlreadyExistsError) {
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
