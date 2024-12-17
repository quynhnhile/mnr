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
  FindContainerByContainerNoQuery,
  FindContainerByContainerNoQueryResult,
} from './find-container-by-container-no.query-handler';

@Controller(routesV1.version)
export class FindContainerByContainerNoHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ContainerMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONTAINER.parent} - ${resourcesV1.CONTAINER.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Container by container number' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'containerNo',
    description: 'Container No',
    type: 'string',
    required: true,
    example: 'BEAU5565497',
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
  @Get(routesV1.container.getOneByContNo)
  async findContainerByContainerNo(
    @Param('containerNo') containerNo: string,
  ): Promise<ContainerResponseDto> {
    const query = new FindContainerByContainerNoQuery(containerNo);
    const result: FindContainerByContainerNoQueryResult =
      await this.queryBus.execute(query);

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
