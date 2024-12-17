import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComponentNotFoundError } from '@modules/component/domain/component.error';
import { ComponentResponseDto } from '@modules/component/dtos/component.response.dto';
import { ComponentMapper } from '@modules/component/mappers/component.mapper';
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
  FindComponentQuery,
  FindComponentQueryResult,
} from './find-component.query-handler';

@Controller(routesV1.version)
export class FindComponentHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ComponentMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COMPONENT.parent} - ${resourcesV1.COMPONENT.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Component' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Component ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ComponentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ComponentNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COMPONENT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.component.getOne)
  async findComponent(
    @Param('id') componentId: bigint,
  ): Promise<ComponentResponseDto> {
    const query = new FindComponentQuery(componentId);
    const result: FindComponentQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (component) => this.mapper.toResponse(component),
      Err: (error) => {
        if (error instanceof ComponentNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
