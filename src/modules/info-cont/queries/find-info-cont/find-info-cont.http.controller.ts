import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { InfoContResponseDto } from '@modules/info-cont/dtos/info-cont.response.dto';
import { InfoContMapper } from '@modules/info-cont/mappers/info-cont.mapper';
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
  FindInfoContQuery,
  FindInfoContQueryResult,
} from './find-info-cont.query-handler';

@Controller(routesV1.version)
export class FindInfoContHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: InfoContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.INFO_CONT.parent} - ${resourcesV1.INFO_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Find one InfoCont' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'InfoCont ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InfoContResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: InfoContNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.INFO_CONT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.infoCont.getOne)
  async findInfoCont(
    @Param('id') infoContId: bigint,
  ): Promise<InfoContResponseDto> {
    const query = new FindInfoContQuery(infoContId);
    const result: FindInfoContQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (infoCont) => this.mapper.toResponse(infoCont),
      Err: (error) => {
        if (error instanceof InfoContNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
