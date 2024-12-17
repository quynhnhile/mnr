import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComDamRepNotFoundError } from '@modules/com-dam-rep/domain/com-dam-rep.error';
import { ComDamRepResponseDto } from '@modules/com-dam-rep/dtos/com-dam-rep.response.dto';
import { ComDamRepMapper } from '@modules/com-dam-rep/mappers/com-dam-rep.mapper';
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
  FindComDamRepQuery,
  FindComDamRepQueryResult,
} from './find-com-dam-rep.query-handler';

@Controller(routesV1.version)
export class FindComDamRepHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ComDamRepMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COM_DAM_REP.parent} - ${resourcesV1.COM_DAM_REP.displayName}`,
  )
  @ApiOperation({ summary: 'Find one ComDamRep' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ComDamRep ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ComDamRepResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ComDamRepNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COM_DAM_REP.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.comDamRep.getOne)
  async findComDamRep(
    @Param('id') comDamRepId: bigint,
  ): Promise<ComDamRepResponseDto> {
    const query = new FindComDamRepQuery(comDamRepId);
    const result: FindComDamRepQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (comDamRep) => this.mapper.toResponse(comDamRep),
      Err: (error) => {
        if (error instanceof ComDamRepNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
