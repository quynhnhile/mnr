import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanModeNotFoundError } from '@modules/clean-mode/domain/clean-mode.error';
import { CleanModeResponseDto } from '@modules/clean-mode/dtos/clean-mode.response.dto';
import { CleanModeMapper } from '@modules/clean-mode/mappers/clean-mode.mapper';
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
  FindCleanModeQuery,
  FindCleanModeQueryResult,
} from './find-clean-mode.query-handler';

@Controller(routesV1.version)
export class FindCleanModeHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CleanModeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_MODE.parent} - ${resourcesV1.CLEAN_MODE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one CleanMode' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'CleanMode ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CleanModeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CleanModeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_MODE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.cleanMode.getOne)
  async findCleanMode(
    @Param('id') cleanModeId: bigint,
  ): Promise<CleanModeResponseDto> {
    const query = new FindCleanModeQuery(cleanModeId);
    const result: FindCleanModeQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (cleanMode) => this.mapper.toResponse(cleanMode),
      Err: (error) => {
        if (error instanceof CleanModeNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
