import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContainerNotFoundError } from '@modules/container/domain/container.error';
import { ContainerResponseDto } from '@modules/container/dtos/container.response.dto';
import { ContainerMapper } from '@modules/container/mappers/container.mapper';
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
  FindContainerQuery,
  FindContainerQueryResult,
} from './find-container.query-handler';

@Controller(routesV1.version)
export class FindContainerHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ContainerMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONTAINER.parent} - ${resourcesV1.CONTAINER.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Container' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Container ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ContainerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ContainerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONTAINER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.container.getOne)
  async findContainer(
    @Param('id') containerId: bigint,
  ): Promise<ContainerResponseDto> {
    const query = new FindContainerQuery(containerId);
    const result: FindContainerQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (container) => this.mapper.toResponse(container),
      Err: (error) => {
        if (error instanceof ContainerNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
