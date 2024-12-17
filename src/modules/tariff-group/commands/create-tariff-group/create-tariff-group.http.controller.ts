import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import { TariffGroupCodeAlreadyExistError } from '@modules/tariff-group/domain/tariff-group.error';
import { TariffGroupResponseDto } from '@modules/tariff-group/dtos/tariff-group.response.dto';
import { TariffGroupMapper } from '@modules/tariff-group/mappers/tariff-group.mapper';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';
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
import { CreateTariffGroupCommand } from './create-tariff-group.command';
import { CreateTariffGroupRequestDto } from './create-tariff-group.request.dto';
import { CreateTariffGroupServiceResult } from './create-tariff-group.service';

@Controller(routesV1.version)
export class CreateTariffGroupHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: TariffGroupMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TARIFF_GROUP.parent} - ${resourcesV1.TARIFF_GROUP.displayName}`,
  )
  @ApiOperation({ summary: 'Create a TariffGroup' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TariffGroupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${OperationNotFoundError.message} | ${VendorNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TariffGroupCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF_GROUP.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.tariffGroup.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateTariffGroupRequestDto,
  ): Promise<TariffGroupResponseDto> {
    const command = new CreateTariffGroupCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateTariffGroupServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (tariffGroup: TariffGroupEntity) =>
        this.mapper.toResponse(tariffGroup),
      Err: (error: Error) => {
        if (
          error instanceof OperationNotFoundError ||
          error instanceof VendorNotFoundError
        ) {
          throw new NotFoundHttpException({
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
