import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageLocalNotFoundError } from '@modules/damage-local/domain/damage-local.error';
import { DamageLocalResponseDto } from '@modules/damage-local/dtos/damage-local.response.dto';
import { DamageLocalMapper } from '@modules/damage-local/mappers/damage-local.mapper';
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
  FindDamageLocalQuery,
  FindDamageLocalQueryResult,
} from './find-damage-local.query-handler';

@Controller(routesV1.version)
export class FindDamageLocalHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: DamageLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.DAMAGE_LOCAL.parent} - ${resourcesV1.DAMAGE_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Find one DamageLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'DamageLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DamageLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: DamageLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE_LOCAL.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.damageLocal.getOne)
  async findDamageLocal(
    @Param('id') damageLocalId: bigint,
  ): Promise<DamageLocalResponseDto> {
    const query = new FindDamageLocalQuery(damageLocalId);
    const result: FindDamageLocalQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (damageLocal) => this.mapper.toResponse(damageLocal),
      Err: (error) => {
        if (error instanceof DamageLocalNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
