import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanMethodNotFoundError } from '@modules/clean-method/domain/clean-method.error';
import { CleanModeNotFoundError } from '@modules/clean-mode/domain/clean-mode.error';
import { ComponentNotFoundError } from '@modules/component/domain/component.error';
import { DamageNotFoundError } from '@modules/damage/domain/damage.error';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
import { EstimateDetailResponseDto } from '@modules/estimate/dtos/estimate-detail.response.dto';
import { EstimateDetailMapper } from '@modules/estimate/mappers/estimate-detail.mapper';
import { LocationNotFoundError } from '@modules/location/domain/location.error';
import { PayerNotFoundError } from '@modules/payer/domain/payer.error';
import { RepairNotFoundError } from '@modules/repair/domain/repair.error';
import {
  Body,
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
import { CalculateTariffCommand } from './calculate-tariff.command';
import { CalculateTariffRequestDto } from './calculate-tariff.request.dto';
import { CalculateTariffServiceResult } from './calculate-tariff.service';

@Controller(routesV1.version)
export class CalculateTariffHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Calculate tariff' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: EstimateDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${EstimateNotFoundError.message} | ${ComponentNotFoundError.message} | ${LocationNotFoundError.message} | ${DamageNotFoundError.message} | ${RepairNotFoundError.message} | ${PayerNotFoundError.message} | ${CleanMethodNotFoundError.message} | ${CleanModeNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.estimate.calculateTariff)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CalculateTariffRequestDto,
  ): Promise<EstimateDetailResponseDto | boolean> {
    const command = new CalculateTariffCommand({
      ...body,
    });

    const result: CalculateTariffServiceResult = await this.commandBus.execute(
      command,
    );
    if (!result) {
      return false;
    }

    return match(result, {
      Ok: (estimateDetail: EstimateDetailEntity) =>
        this.mapper.toResponse(estimateDetail),
      Err: (error: Error) => {
        if (
          error instanceof EstimateNotFoundError ||
          error instanceof ComponentNotFoundError ||
          error instanceof LocationNotFoundError ||
          error instanceof DamageNotFoundError ||
          error instanceof RepairNotFoundError ||
          error instanceof PayerNotFoundError ||
          error instanceof CleanMethodNotFoundError ||
          error instanceof CleanModeNotFoundError
        ) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
