import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { MnrOverPaginatedResponseDto } from '@modules/mnr-over/dtos/mnr-over.paginated.response.dto';
import { MnrOverMapper } from '@modules/mnr-over/mappers/mnr-over.mapper';
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
  FindMnrOversQuery,
  FindMnrOversQueryResult,
} from './find-mnr-overs.query-handler';
import { FindMnrOversRequestDto } from './find-mnr-overs.request.dto';
import { Prisma } from '@prisma/client';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { MnrOverScalarFieldEnum } from '../../database/mnr-over.repository.prisma';

@Controller(routesV1.version)
export class FindMnrOversHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MnrOverMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.MNR_OVER.parent} - ${resourcesV1.MNR_OVER.displayName}`,
  )
  @ApiOperation({ summary: 'Find MnrOvers' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindMnrOversRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindMnrOversRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MnrOverPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.MNR_OVER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.mnrOver.root)
  async findMnrOvers(
    @Query(
      new DirectFilterPipe<any, Prisma.ConfigMnROverWhereInput>([
        MnrOverScalarFieldEnum.id,
        MnrOverScalarFieldEnum.statusTypeCode,
        MnrOverScalarFieldEnum.contType,
        MnrOverScalarFieldEnum.jobModeCode,
        MnrOverScalarFieldEnum.methodCode,
        MnrOverScalarFieldEnum.startDate,
        MnrOverScalarFieldEnum.endDate,
        MnrOverScalarFieldEnum.pti,
        MnrOverScalarFieldEnum.from,
        MnrOverScalarFieldEnum.to,
        MnrOverScalarFieldEnum.unit,
        MnrOverScalarFieldEnum.quantity,
      ]),
    )
    queryParams: FindMnrOversRequestDto,
  ): Promise<MnrOverPaginatedResponseDto> {
    const query = new FindMnrOversQuery(queryParams.findOptions);
    const result: FindMnrOversQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new MnrOverPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
