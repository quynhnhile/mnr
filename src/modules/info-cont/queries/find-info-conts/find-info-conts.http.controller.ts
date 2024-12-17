import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { InfoContScalarFieldEnum } from '@modules/info-cont/database/info-cont.repository.prisma';
import { InfoContPaginatedResponseDto } from '@modules/info-cont/dtos/info-cont.paginated.response.dto';
import { InfoContMapper } from '@modules/info-cont/mappers/info-cont.mapper';
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
  FindInfoContsQuery,
  FindInfoContsQueryResult,
} from './find-info-conts.query-handler';
import { FindInfoContsRequestDto } from './find-info-conts.request.dto';

@Controller(routesV1.version)
export class FindInfoContsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: InfoContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.INFO_CONT.parent} - ${resourcesV1.INFO_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Find InfoConts' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindInfoContsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindInfoContsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InfoContPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.INFO_CONT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.infoCont.root)
  async findInfoConts(
    @Query(
      new DirectFilterPipe<any, Prisma.InfoContWhereInput>([
        InfoContScalarFieldEnum.id,
        InfoContScalarFieldEnum.containerNo,
        InfoContScalarFieldEnum.operationCode,
        InfoContScalarFieldEnum.ownerCode,
        InfoContScalarFieldEnum.localSizeType,
        InfoContScalarFieldEnum.isoSizeType,
        InfoContScalarFieldEnum.contType,
        InfoContScalarFieldEnum.contAge,
        InfoContScalarFieldEnum.machineAge,
        InfoContScalarFieldEnum.machineBrand,
        InfoContScalarFieldEnum.machineModel,
        InfoContScalarFieldEnum.tareWeight,
        InfoContScalarFieldEnum.maxGrossWeight,
        InfoContScalarFieldEnum.net,
        InfoContScalarFieldEnum.capacity,
        InfoContScalarFieldEnum.lastTest,
        InfoContScalarFieldEnum.typeTest,
      ]),
    )
    queryParams: FindInfoContsRequestDto,
  ): Promise<InfoContPaginatedResponseDto> {
    const query = new FindInfoContsQuery(queryParams.findOptions);
    const result: FindInfoContsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new InfoContPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
