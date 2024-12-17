import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { PayerScalarFieldEnum } from '@modules/payer/database/payer.repository.prisma';
import { PayerPaginatedResponseDto } from '@modules/payer/dtos/payer.paginated.response.dto';
import { PayerMapper } from '@modules/payer/mappers/payer.mapper';
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
  FindPayersQuery,
  FindPayersQueryResult,
} from './find-payers.query-handler';
import { FindPayersRequestDto } from './find-payers.request.dto';

@Controller(routesV1.version)
export class FindPayersHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: PayerMapper,
  ) {}

  @ApiTags(`${resourcesV1.PAYER.parent} - ${resourcesV1.PAYER.displayName}`)
  @ApiOperation({ summary: 'Find Payers' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindPayersRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindPayersRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayerPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.PAYER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.payer.root)
  async findPayers(
    @Query(
      new DirectFilterPipe<any, Prisma.PayerWhereInput>([
        PayerScalarFieldEnum.id,
        PayerScalarFieldEnum.payerCode,
        PayerScalarFieldEnum.payerName,
        PayerScalarFieldEnum.mappingTos,
      ]),
    )
    queryParams: FindPayersRequestDto,
  ): Promise<PayerPaginatedResponseDto> {
    const query = new FindPayersQuery(queryParams.findOptions);
    const result: FindPayersQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new PayerPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
