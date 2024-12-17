import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanModeScalarFieldEnum } from '@modules/clean-mode/database/clean-mode.repository.prisma';
import { CleanModePaginatedResponseDto } from '@modules/clean-mode/dtos/clean-mode.paginated.response.dto';
import { CleanModeMapper } from '@modules/clean-mode/mappers/clean-mode.mapper';
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
  FindCleanModesQuery,
  FindCleanModesQueryResult,
} from './find-clean-modes.query-handler';
import { FindCleanModesRequestDto } from './find-clean-modes.request.dto';

@Controller(routesV1.version)
export class FindCleanModesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CleanModeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_MODE.parent} - ${resourcesV1.CLEAN_MODE.displayName}`,
  )
  @ApiOperation({ summary: 'Find CleanModes' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindCleanModesRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindCleanModesRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CleanModePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CLEAN_MODE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.cleanMode.root)
  async findCleanModes(
    @Query(
      new DirectFilterPipe<any, Prisma.CleanModeWhereInput>([
        CleanModeScalarFieldEnum.id,
        CleanModeScalarFieldEnum.operationCode,
        CleanModeScalarFieldEnum.cleanModeCode,
        CleanModeScalarFieldEnum.cleanModeName,
      ]),
    )
    queryParams: FindCleanModesRequestDto,
  ): Promise<CleanModePaginatedResponseDto> {
    const query = new FindCleanModesQuery(queryParams.findOptions);
    const result: FindCleanModesQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new CleanModePaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
