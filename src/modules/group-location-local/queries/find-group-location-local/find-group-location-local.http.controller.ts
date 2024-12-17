import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { GroupLocationLocalNotFoundError } from '@modules/group-location-local/domain/group-location-local.error';
import { GroupLocationLocalResponseDto } from '@modules/group-location-local/dtos/group-location-local.response.dto';
import { GroupLocationLocalMapper } from '@modules/group-location-local/mappers/group-location-local.mapper';
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
  FindGroupLocationLocalQuery,
  FindGroupLocationLocalQueryResult,
} from './find-group-location-local.query-handler';

@Controller(routesV1.version)
export class FindGroupLocationLocalHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: GroupLocationLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.GROUP_LOCATION_LOCAL.parent} - ${resourcesV1.GROUP_LOCATION_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find one GroupLocationLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'GroupLocationLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GroupLocationLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: GroupLocationLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.GROUP_LOCATION_LOCAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.groupLocationLocal.getOne)
  async findGroupLocationLocal(
    @Param('id') groupLocationLocalId: bigint,
  ): Promise<GroupLocationLocalResponseDto> {
    const query = new FindGroupLocationLocalQuery(groupLocationLocalId);
    const result: FindGroupLocationLocalQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (groupLocationLocal) => this.mapper.toResponse(groupLocationLocal),
      Err: (error) => {
        if (error instanceof GroupLocationLocalNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
