import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import { VendorTypeCodeAlreadyExistsError } from '@modules/vendor-type/domain/vendor-type.error';
import { VendorTypeResponseDto } from '@modules/vendor-type/dtos/vendor-type.response.dto';
import { VendorTypeMapper } from '@modules/vendor-type/mappers/vendor-type.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVendorTypeCommand } from './create-vendor-type.command';
import { CreateVendorTypeRequestDto } from './create-vendor-type.request.dto';
import { CreateVendorTypeCommandResult } from './create-vendor-type.service';

@Controller(routesV1.version)
export class CreateVendorTypeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: VendorTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.VENDOR_TYPE.parent} - ${resourcesV1.VENDOR_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Create a VendorType' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: VendorTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: VendorTypeCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR_TYPE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.vendorType.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateVendorTypeRequestDto,
  ): Promise<VendorTypeResponseDto> {
    const command = new CreateVendorTypeCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateVendorTypeCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (vendortype: VendorTypeEntity) => this.mapper.toResponse(vendortype),
      Err: (error: Error) => {
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
