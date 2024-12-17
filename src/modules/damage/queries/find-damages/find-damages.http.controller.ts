import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageScalarFieldEnum } from '@modules/damage/database/damage.repository.prisma';
import { DamagePaginatedResponseDto } from '@modules/damage/dtos/damage.paginated.response.dto';
import { DamageMapper } from '@modules/damage/mappers/damage.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  FindDamagesQuery,
  FindDamagesQueryResult,
} from './find-damages.query-handler';
import { FindDamagesRequestDto } from './find-damages.request.dto';

@Controller(routesV1.version)
export class FindDamagesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: DamageMapper,
  ) {}

  @ApiTags(`${resourcesV1.DAMAGE.parent} - ${resourcesV1.DAMAGE.displayName}`)
  @ApiOperation({ summary: 'Find Damages' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindDamagesRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindDamagesRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DamagePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.DAMAGE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.damage.root)
  async findDamages(
    @Query(
      new DirectFilterPipe<any, Prisma.DamageWhereInput>([
        DamageScalarFieldEnum.id,
        DamageScalarFieldEnum.operationCode,
        DamageScalarFieldEnum.damCode,
        DamageScalarFieldEnum.damNameEn,
        DamageScalarFieldEnum.damNameVi,
      ]),
    )
    queryParams: FindDamagesRequestDto,
  ): Promise<DamagePaginatedResponseDto> {
    const query = new FindDamagesQuery(queryParams.findOptions);
    const result: FindDamagesQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new DamagePaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
