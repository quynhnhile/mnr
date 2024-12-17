import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { StatusTypeNotFoundError } from '@modules/status-type/domain/status-type.error';
import { StatusTypeResponseDto } from '@modules/status-type/dtos/status-type.response.dto';
import { StatusTypeMapper } from '@modules/status-type/mappers/status-type.mapper';
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
  FindStatusTypeQuery,
  FindStatusTypeQueryResult,
} from './find-status-type.query-handler';

@Controller(routesV1.version)
export class FindStatusTypeHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: StatusTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.STATUS_TYPE.parent} - ${resourcesV1.STATUS_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one StatusType' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'StatusType ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: StatusTypeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.STATUS_TYPE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.statusType.getOne)
  async findStatusType(
    @Param('id') statusTypeId: bigint,
  ): Promise<StatusTypeResponseDto> {
    const query = new FindStatusTypeQuery(statusTypeId);
    const result: FindStatusTypeQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (statusType) => this.mapper.toResponse(statusType),
      Err: (error) => {
        if (error instanceof StatusTypeNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
