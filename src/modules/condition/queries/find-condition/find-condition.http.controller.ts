import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionNotFoundError } from '@modules/condition/domain/condition.error';
import { ConditionResponseDto } from '@modules/condition/dtos/condition.response.dto';
import { ConditionMapper } from '@modules/condition/mappers/condition.mapper';
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
  FindConditionQuery,
  FindConditionQueryResult,
} from './find-condition.query-handler';

@Controller(routesV1.version)
export class FindConditionHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ConditionMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION.parent} - ${resourcesV1.CONDITION.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Condition' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Condition ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ConditionNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.condition.getOne)
  async findCondition(
    @Param('id') conditionId: bigint,
  ): Promise<ConditionResponseDto> {
    const query = new FindConditionQuery(conditionId);
    const result: FindConditionQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (condition) => this.mapper.toResponse(condition),
      Err: (error) => {
        if (error instanceof ConditionNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
