import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionReeferPaginatedResponseDto } from '@modules/condition-reefer/dtos/condition-reefer.paginated.response.dto';
import { ConditionReeferMapper } from '@modules/condition-reefer/mappers/condition-reefer.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindConditionReefersQuery,
  FindConditionReefersQueryResult,
} from './find-condition-reefers.query-handler';
import { FindConditionReefersRequestDto } from './find-condition-reefers.request.dto';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { ConditionReeferScalarFieldEnum } from '../../database/condition-reefer.repository.prisma';

@Controller(routesV1.version)
export class FindConditionReefersHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ConditionReeferMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION_REEFER.parent} - ${resourcesV1.CONDITION_REEFER.displayName}`,
  )
  @ApiOperation({ summary: 'Find ConditionReefers' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConditionReeferPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CONDITION_REEFER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.conditionReefer.root)
  async findConditionReefers(
    @Query(
      new DirectFilterPipe<any, Prisma.ConditionReeferWhereInput>([
        ConditionReeferScalarFieldEnum.id,
        ConditionReeferScalarFieldEnum.operationCode,
        ConditionReeferScalarFieldEnum.conditionCode,
        ConditionReeferScalarFieldEnum.conditionMachineCode,
        ConditionReeferScalarFieldEnum.isDamage,
        ConditionReeferScalarFieldEnum.mappingCode,
      ]),
    )
    queryParams: FindConditionReefersRequestDto,
  ): Promise<ConditionReeferPaginatedResponseDto> {
    const query = new FindConditionReefersQuery(queryParams.findOptions);
    const result: FindConditionReefersQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ConditionReeferPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
