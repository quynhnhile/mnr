import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { OperationScalarFieldEnum } from '@modules/operation/database/operation.repository.prisma';
import { OperationPaginatedResponseDto } from '@modules/operation/dtos/operation.paginated.response.dto';
import { OperationMapper } from '@modules/operation/mappers/operation.mapper';
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
  FindOperationsQuery,
  FindOperationsQueryResult,
} from './find-operations.query-handler';
import { FindOperationsRequestDto } from './find-operations.request.dto';

@Controller(routesV1.version)
export class FindOperationsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OperationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.OPERATION.parent} - ${resourcesV1.OPERATION.displayName}`,
  )
  @ApiOperation({ summary: 'Find Operations' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindOperationsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindOperationsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OperationPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.OPERATION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.operation.root)
  async findOperations(
    @Query(
      new DirectFilterPipe<any, Prisma.OperationWhereInput>([
        OperationScalarFieldEnum.id,
        OperationScalarFieldEnum.operationCode,
        OperationScalarFieldEnum.operationName,
        OperationScalarFieldEnum.isEdo,
        OperationScalarFieldEnum.isLocalForeign,
        OperationScalarFieldEnum.isActive,
        OperationScalarFieldEnum.moneyCredit,
      ]),
    )
    queryParams: FindOperationsRequestDto,
  ): Promise<OperationPaginatedResponseDto> {
    const query = new FindOperationsQuery(queryParams.findOptions);
    const result: FindOperationsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new OperationPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
