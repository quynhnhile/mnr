import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ConditionReeferNotFoundError } from '@modules/condition-reefer/domain/condition-reefer.error';
import { ConditionReeferResponseDto } from '@modules/condition-reefer/dtos/condition-reefer.response.dto';
import { ConditionReeferMapper } from '@modules/condition-reefer/mappers/condition-reefer.mapper';
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
  FindConditionReeferQuery,
  FindConditionReeferQueryResult,
} from './find-condition-reefer.query-handler';

@Controller(routesV1.version)
export class FindConditionReeferHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ConditionReeferMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONDITION_REEFER.parent} - ${resourcesV1.CONDITION_REEFER.displayName}`,
  )
  @ApiOperation({ summary: 'Find one ConditionReefer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ConditionReefer ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConditionReeferResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ConditionReeferNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONDITION_REEFER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.conditionReefer.getOne)
  async findConditionReefer(
    @Param('id') conditionReeferId: bigint,
  ): Promise<ConditionReeferResponseDto> {
    const query = new FindConditionReeferQuery(conditionReeferId);
    const result: FindConditionReeferQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (conditionReefer) => this.mapper.toResponse(conditionReefer),
      Err: (error) => {
        if (error instanceof ConditionReeferNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
