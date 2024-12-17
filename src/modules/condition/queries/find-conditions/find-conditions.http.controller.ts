import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionPaginatedResponseDto } from '@modules/condition/dtos/condition.paginated.response.dto';
import { ConditionMapper } from '@modules/condition/mappers/condition.mapper';
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
import {
  FindConditionsQuery,
  FindConditionsQueryResult,
} from './find-conditions.query-handler';
import { FindConditionsRequestDto } from './find-conditions.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { ConditionScalarFieldEnum } from '../../database/condition.repository.prisma';

@Controller(routesV1.version)
export class FindConditionsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ConditionMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION.parent} - ${resourcesV1.CONDITION.displayName}`,
  )
  @ApiOperation({ summary: 'Find Conditions' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindConditionsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindConditionsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConditionPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CONDITION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.condition.root)
  async findConditions(
    @Query(
      new DirectFilterPipe<any, Prisma.ConditionWhereInput>([
        ConditionScalarFieldEnum.id,
        ConditionScalarFieldEnum.operationCode,
        ConditionScalarFieldEnum.conditionCode,
        ConditionScalarFieldEnum.conditionName,
        ConditionScalarFieldEnum.isDamage,
        ConditionScalarFieldEnum.isMachine,
        ConditionScalarFieldEnum.mappingCode,
      ]),
    )
    queryParams: FindConditionsRequestDto,
  ): Promise<ConditionPaginatedResponseDto> {
    const query = new FindConditionsQuery(queryParams.findOptions);
    const result: FindConditionsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ConditionPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
