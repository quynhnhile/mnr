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
import { TariffAlreadyExistsError } from '@modules/tariff/domain/tariff.error';
import { TariffResponseDto } from '@modules/tariff/dtos/tariff.response.dto';
import { TariffMapper } from '@modules/tariff/mappers/tariff.mapper';
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
import { CreateTariffCommand } from './create-tariff.command';
import { CreateTariffRequestDto } from './create-tariff.request.dto';
import { CreateTariffServiceResult } from './create-tariff.service';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';

@Controller(routesV1.version)
export class CreateTariffHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: TariffMapper,
  ) {}

  @ApiTags(`${resourcesV1.TARIFF.parent} - ${resourcesV1.TARIFF.displayName}`)
  @ApiOperation({ summary: 'Create a Tariff' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TariffResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${TariffGroupNotFoundError.message} | ${ComponentNotFoundError.message} | ${LocationNotFoundError.message} | ${RepairNotFoundError.message} | ${DamageNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TariffAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.tariff.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateTariffRequestDto,
  ): Promise<TariffResponseDto> {
    const command = new CreateTariffCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateTariffServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (tariff: TariffEntity) => this.mapper.toResponse(tariff),
      Err: (error: Error) => {
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
