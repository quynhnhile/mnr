import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ClassifyScalarFieldEnum } from '@modules/classify/database/classify.repository.prisma';
import { ClassifyPaginatedResponseDto } from '@modules/classify/dtos/classify.paginated.response.dto';
import { ClassifyMapper } from '@modules/classify/mappers/classify.mapper';
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
  FindClassifiesQuery,
  FindClassifiesQueryResult,
} from './find-classifies.query-handler';
import { FindClassifiesRequestDto } from './find-classifies.request.dto';

@Controller(routesV1.version)
export class FindClassifiesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ClassifyMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLASSIFY.parent} - ${resourcesV1.CLASSIFY.displayName}`,
  )
  @ApiOperation({ summary: 'Find Classifies' })
  @ApiBearerAuth()
  @ApiQuery({
    type: FindClassifiesRequestDto,
    required: false,
    description: 'Filter to apply',
    schema: {
      $ref: getSchemaPath(FindClassifiesRequestDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClassifyPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.CLASSIFY.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.classify.root)
  async findClassifies(
    @Query(
      new DirectFilterPipe<any, Prisma.ClassifyWhereInput>([
        ClassifyScalarFieldEnum.id,
        ClassifyScalarFieldEnum.operationCode,
        ClassifyScalarFieldEnum.classifyCode,
        ClassifyScalarFieldEnum.classifyName,
        ClassifyScalarFieldEnum.mappingCode,
      ]),
    )
    queryParams: FindClassifiesRequestDto,
  ): Promise<ClassifyPaginatedResponseDto> {
    const query = new FindClassifiesQuery(queryParams.findOptions);
    const result: FindClassifiesQueryResult = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    return new ClassifyPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
