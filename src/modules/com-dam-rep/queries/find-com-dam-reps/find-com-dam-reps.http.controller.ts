import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComDamRepScalarFieldEnum } from '@modules/com-dam-rep/database/com-dam-rep.repository.prisma';
import { ComDamRepPaginatedResponseDto } from '@modules/com-dam-rep/dtos/com-dam-rep.paginated.response.dto';
import { ComDamRepMapper } from '@modules/com-dam-rep/mappers/com-dam-rep.mapper';
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
  FindComDamRepsQuery,
  FindComDamRepsQueryResult,
} from './find-com-dam-reps.query-handler';
import { FindComDamRepsRequestDto } from './find-com-dam-reps.request.dto';

@Controller(routesV1.version)
export class FindComDamRepsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ComDamRepMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COM_DAM_REP.parent} - ${resourcesV1.COM_DAM_REP.displayName}`,
  )
  @ApiOperation({ summary: 'Find ComDamReps' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindComDamRepsRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindComDamRepsRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ComDamRepPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.COM_DAM_REP.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.comDamRep.root)
  async findComDamReps(
    @Query(
      new DirectFilterPipe<any, Prisma.ComDamRepWhereInput>([
        ComDamRepScalarFieldEnum.id,
        ComDamRepScalarFieldEnum.compCode,
        ComDamRepScalarFieldEnum.damCode,
        ComDamRepScalarFieldEnum.repCode,
        ComDamRepScalarFieldEnum.nameEn,
        ComDamRepScalarFieldEnum.nameVi,
      ]),
    )
    queryParams: FindComDamRepsRequestDto,
  ): Promise<ComDamRepPaginatedResponseDto> {
    const query = new FindComDamRepsQuery(queryParams.findOptions);
    const result: FindComDamRepsQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ComDamRepPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
