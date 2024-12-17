import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { TariffGroupNotFoundError } from '@modules/tariff-group/domain/tariff-group.error';
import { TariffGroupResponseDto } from '@modules/tariff-group/dtos/tariff-group.response.dto';
import { TariffGroupMapper } from '@modules/tariff-group/mappers/tariff-group.mapper';
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
  FindTariffGroupQuery,
  FindTariffGroupQueryResult,
} from './find-tariff-group.query-handler';

@Controller(routesV1.version)
export class FindTariffGroupHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TariffGroupMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.TARIFF_GROUP.parent} - ${resourcesV1.TARIFF_GROUP.displayName}`,
  )
  @ApiOperation({ summary: 'Find one TariffGroup' })
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
    description: TariffGroupNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.TARIFF_GROUP.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.tariffGroup.getOne)
  async findTariffGroup(
    @Param('id') tariffGroupId: bigint,
  ): Promise<TariffGroupResponseDto> {
    const query = new FindTariffGroupQuery(tariffGroupId);
    const result: FindTariffGroupQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (tariffGroup) => this.mapper.toResponse(tariffGroup),
      Err: (error) => {
        if (error instanceof TariffGroupNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
