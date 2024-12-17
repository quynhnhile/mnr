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
import { VendorCodeAlreadyExistsError } from '@modules/vendor/domain/vendor.error';
import { VendorResponseDto } from '@modules/vendor/dtos/vendor.response.dto';
import { VendorMapper } from '@modules/vendor/mappers/vendor.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
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
import { CreateVendorCommand } from './create-vendor.command';
import { CreateVendorRequestDto } from './create-vendor.request.dto';
import { CreateVendorCommandResult } from './create-vendor.service';

@Controller(routesV1.version)
export class CreateVendorHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: VendorMapper,
  ) {}

  @ApiTags(`${resourcesV1.VENDOR.parent} - ${resourcesV1.VENDOR.displayName}`)
  @ApiOperation({ summary: 'Create a Vendor' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: VendorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: VendorCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.VENDOR.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.vendor.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateVendorRequestDto,
  ): Promise<VendorResponseDto> {
    const command = new CreateVendorCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateVendorCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (vendor: VendorEntity) => this.mapper.toResponse(vendor),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
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
