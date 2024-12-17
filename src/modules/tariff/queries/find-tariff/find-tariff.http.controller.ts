import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TariffNotFoundError } from '@modules/tariff/domain/tariff.error';
import { TariffResponseDto } from '@modules/tariff/dtos/tariff.response.dto';
import { TariffMapper } from '@modules/tariff/mappers/tariff.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindTariffQuery,
  FindTariffQueryResult,
} from './find-tariff.query-handler';

@Controller(routesV1.version)
export class FindTariffHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TariffMapper,
  ) {}

  @ApiTags(`${resourcesV1.TARIFF.parent} - ${resourcesV1.TARIFF.displayName}`)
  @ApiOperation({ summary: 'Find one Tariff' })
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
    description: TariffNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.tariff.getOne)
  async findTariff(@Param('id') tariffId: bigint): Promise<TariffResponseDto> {
    const query = new FindTariffQuery(tariffId);
    const result: FindTariffQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (tariff) => this.mapper.toResponse(tariff),
      Err: (error) => {
        if (error instanceof TariffNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
