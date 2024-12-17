import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocalDmgDetailNotFoundError } from '@modules/local-dmg-detail/domain/local-dmg-detail.error';
import { LocalDmgDetailResponseDto } from '@modules/local-dmg-detail/dtos/local-dmg-detail.response.dto';
import { LocalDmgDetailMapper } from '@modules/local-dmg-detail/mappers/local-dmg-detail.mapper';
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
  FindLocalDmgDetailQuery,
  FindLocalDmgDetailQueryResult,
} from './find-local-dmg-detail.query-handler';

@Controller(routesV1.version)
export class FindLocalDmgDetailHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: LocalDmgDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCAL_DMG_DETAIL.parent} - ${resourcesV1.LOCAL_DMG_DETAIL.displayName}`,
  )
  @ApiOperation({ summary: 'Find one LocalDmgDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'LocalDmgDetail ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocalDmgDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocalDmgDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCAL_DMG_DETAIL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.localDmgDetail.getOne)
  async findLocalDmgDetail(
    @Param('id') localDmgDetailId: bigint,
  ): Promise<LocalDmgDetailResponseDto> {
    const query = new FindLocalDmgDetailQuery(localDmgDetailId);
    const result: FindLocalDmgDetailQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (localDmgDetail) => this.mapper.toResponse(localDmgDetail),
      Err: (error) => {
        if (error instanceof LocalDmgDetailNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
