import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageNotFoundError } from '@modules/damage/domain/damage.error';
import { DamageResponseDto } from '@modules/damage/dtos/damage.response.dto';
import { DamageMapper } from '@modules/damage/mappers/damage.mapper';
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
  FindDamageQuery,
  FindDamageQueryResult,
} from './find-damage.query-handler';

@Controller(routesV1.version)
export class FindDamageHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: DamageMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.DAMAGE.parent} - ${resourcesV1.DAMAGE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one Damage' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Damage ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DamageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: DamageNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.damage.getOne)
  async findDamage(
    @Param('id') damageId: bigint,
  ): Promise<DamageResponseDto> {
    const query = new FindDamageQuery(damageId);
    const result: FindDamageQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (damage) => this.mapper.toResponse(damage),
      Err: (error) => {
        if (error instanceof DamageNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
