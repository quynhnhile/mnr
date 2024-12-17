import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import {
  TariffGroupCodeAlreadyExistError,
  TariffGroupCodeAlreadyInUseError,
  TariffGroupNotFoundError,
} from '@modules/tariff-group/domain/tariff-group.error';
import { TariffGroupResponseDto } from '@modules/tariff-group/dtos/tariff-group.response.dto';
import { TariffGroupMapper } from '@modules/tariff-group/mappers/tariff-group.mapper';
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
import { UpdateTariffGroupCommand } from './update-tariff-group.command';
import { UpdateTariffGroupRequestDto } from './update-tariff-group.request.dto';
import { UpdateTariffGroupServiceResult } from './update-tariff-group.service';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';

@Controller(routesV1.version)
export class UpdateTariffGroupHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: TariffGroupMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TARIFF_GROUP.parent} - ${resourcesV1.TARIFF_GROUP.displayName}`,
  )
  @ApiOperation({ summary: 'Update a TariffGroup' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'TariffGroup ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TariffGroupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${TariffGroupNotFoundError.message} | ${OperationNotFoundError.message} | ${VendorNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: TariffGroupCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TariffGroupCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF_GROUP.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.tariffGroup.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') tariffGroupId: bigint,
    @Body() body: UpdateTariffGroupRequestDto,
  ): Promise<TariffGroupResponseDto> {
    const command = new UpdateTariffGroupCommand({
      tariffGroupId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateTariffGroupServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (tariffGroup: TariffGroupEntity) =>
        this.mapper.toResponse(tariffGroup),
      Err: (error: Error) => {
        if (
          error instanceof TariffGroupNotFoundError ||
          error instanceof OperationNotFoundError ||
          error instanceof VendorNotFoundError
        ) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof TariffGroupCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof TariffGroupCodeAlreadyExistError) {
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
