import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ClassifyNotFoundError } from '@modules/classify/domain/classify.error';
import { ClassifyResponseDto } from '@modules/classify/dtos/classify.response.dto';
import { ClassifyMapper } from '@modules/classify/mappers/classify.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindClassifyQuery,
  FindClassifyQueryResult,
} from './find-classify.query-handler';

@Controller(routesV1.version)
export class FindClassifyHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ClassifyMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLASSIFY.parent} - ${resourcesV1.CLASSIFY.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Classify' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Classify ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClassifyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClassifyNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLASSIFY.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.classify.getOne)
  async findClassify(
    @Param('id') classifyId: bigint,
  ): Promise<ClassifyResponseDto> {
    const query = new FindClassifyQuery(classifyId);
    const result: FindClassifyQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (classify) => this.mapper.toResponse(classify),
      Err: (error) => {
        if (error instanceof ClassifyNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
