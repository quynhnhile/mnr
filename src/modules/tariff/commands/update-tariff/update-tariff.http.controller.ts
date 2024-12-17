import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComponentNotFoundError } from '@modules/component/domain/component.error';
import { LocationNotFoundError } from '@modules/location/domain/location.error';
import { RepairNotFoundError } from '@modules/repair/domain/repair.error';
import { TariffGroupNotFoundError } from '@modules/tariff-group/domain/tariff-group.error';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import {
  TariffAlreadyExistsError,
  TariffNotFoundError,
} from '@modules/tariff/domain/tariff.error';
import { TariffResponseDto } from '@modules/tariff/dtos/tariff.response.dto';
import { TariffMapper } from '@modules/tariff/mappers/tariff.mapper';
import {
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
import { UpdateTariffCommand } from './update-tariff.command';
import { UpdateTariffRequestDto } from './update-tariff.request.dto';
import { UpdateTariffServiceResult } from './update-tariff.service';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';

@Controller(routesV1.version)
export class UpdateTariffHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: TariffMapper,
  ) {}

  @ApiTags(`${resourcesV1.TARIFF.parent} - ${resourcesV1.TARIFF.displayName}`)
  @ApiOperation({ summary: 'Update a Tariff' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Tariff ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TariffResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${TariffNotFoundError.message} | ${TariffGroupNotFoundError.message} | ${ComponentNotFoundError.message} | ${LocationNotFoundError.message} | ${RepairNotFoundError.message} | ${DamageNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TariffAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.tariff.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') tariffId: bigint,
    @Body() body: UpdateTariffRequestDto,
  ): Promise<TariffResponseDto> {
    const command = new UpdateTariffCommand({
      tariffId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateTariffServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (tariff: TariffEntity) => this.mapper.toResponse(tariff),
      Err: (error: Error) => {
        if (error instanceof TariffNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        // TODO: add catch for damage not found
        if (
          error instanceof TariffGroupNotFoundError ||
          error instanceof ComponentNotFoundError ||
          error instanceof LocationNotFoundError ||
          error instanceof RepairNotFoundError ||
          error instanceof DamageNotFoundError
        ) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof TariffAlreadyExistsError) {
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
