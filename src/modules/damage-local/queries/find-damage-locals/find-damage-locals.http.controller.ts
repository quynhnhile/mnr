import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageLocalPaginatedResponseDto } from '@modules/damage-local/dtos/damage-local.paginated.response.dto';
import { DamageLocalMapper } from '@modules/damage-local/mappers/damage-local.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindDamageLocalsQuery,
  FindDamageLocalsQueryResult,
} from './find-damage-locals.query-handler';
import { FindDamageLocalsRequestDto } from './find-damage-locals.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { DamageLocalScalarFieldEnum } from '../../database/damage-local.repository.prisma';

@Controller(routesV1.version)
export class FindDamageLocalsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: DamageLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.DAMAGE_LOCAL.parent} - ${resourcesV1.DAMAGE_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find DamageLocals' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: DamageLocalPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.DAMAGE_LOCAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.damageLocal.root)
  async findDamageLocals(
    @Query(
      new DirectFilterPipe<any, Prisma.DamageLocalWhereInput>([
        DamageLocalScalarFieldEnum.id,
        DamageLocalScalarFieldEnum.damLocalCode,
        DamageLocalScalarFieldEnum.damLocalNameEn,
        DamageLocalScalarFieldEnum.damLocalNameVi,
      ]),
    )
    queryParams: FindDamageLocalsRequestDto,
  ): Promise<DamageLocalPaginatedResponseDto> {
    const query = new FindDamageLocalsQuery(queryParams.findOptions);
    const result: FindDamageLocalsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new DamageLocalPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
