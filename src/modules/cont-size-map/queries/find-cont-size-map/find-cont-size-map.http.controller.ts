import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContSizeMapNotFoundError } from '@modules/cont-size-map/domain/cont-size-map.error';
import { ContSizeMapResponseDto } from '@modules/cont-size-map/dtos/cont-size-map.response.dto';
import { ContSizeMapMapper } from '@modules/cont-size-map/mappers/cont-size-map.mapper';
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
  FindContSizeMapQuery,
  FindContSizeMapQueryResult,
} from './find-cont-size-map.query-handler';

@Controller(routesV1.version)
export class FindContSizeMapHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ContSizeMapMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONT_SIZE_MAP.parent} - ${resourcesV1.CONT_SIZE_MAP.displayName}`,
  )
  @ApiOperation({ summary: 'Find one ContSizeMap' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ContSizeMap ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ContSizeMapResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ContSizeMapNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONT_SIZE_MAP.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.contSizeMap.getOne)
  async findContSizeMap(
    @Param('id') contSizeMapId: bigint,
  ): Promise<ContSizeMapResponseDto> {
    const query = new FindContSizeMapQuery(contSizeMapId);
    const result: FindContSizeMapQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (contSizeMap) => this.mapper.toResponse(contSizeMap),
      Err: (error) => {
        if (error instanceof ContSizeMapNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
