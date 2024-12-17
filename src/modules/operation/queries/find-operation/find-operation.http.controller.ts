import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OperationResponseDto } from '@modules/operation/dtos/operation.response.dto';
import { OperationMapper } from '@modules/operation/mappers/operation.mapper';
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
  FindOperationQuery,
  FindOperationQueryResult,
} from './find-operation.query-handler';

@Controller(routesV1.version)
export class FindOperationHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OperationMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.OPERATION.parent} - ${resourcesV1.OPERATION.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Operation' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Operation ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OperationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.OPERATION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.operation.getOne)
  async findOperation(
    @Param('id') operationId: bigint,
  ): Promise<OperationResponseDto> {
    const query = new FindOperationQuery(operationId);
    const result: FindOperationQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (operation) => this.mapper.toResponse(operation),
      Err: (error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
