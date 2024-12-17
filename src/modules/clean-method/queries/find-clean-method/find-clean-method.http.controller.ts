import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanMethodNotFoundError } from '@modules/clean-method/domain/clean-method.error';
import { CleanMethodResponseDto } from '@modules/clean-method/dtos/clean-method.response.dto';
import { CleanMethodMapper } from '@modules/clean-method/mappers/clean-method.mapper';
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
  FindCleanMethodQuery,
  FindCleanMethodQueryResult,
} from './find-clean-method.query-handler';

@Controller(routesV1.version)
export class FindCleanMethodHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CleanMethodMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_METHOD.parent} - ${resourcesV1.CLEAN_METHOD.displayName}`,
  )
  @ApiOperation({ summary: 'Find one CleanMethod' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'CleanMethod ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CleanMethodResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CleanMethodNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_METHOD.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.cleanMethod.getOne)
  async findCleanMethod(
    @Param('id') cleanMethodId: bigint,
  ): Promise<CleanMethodResponseDto> {
    const query = new FindCleanMethodQuery(cleanMethodId);
    const result: FindCleanMethodQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (cleanMethod) => this.mapper.toResponse(cleanMethod),
      Err: (error) => {
        if (error instanceof CleanMethodNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
