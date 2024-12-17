import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairNotFoundError } from '@modules/repair/domain/repair.error';
import { RepairResponseDto } from '@modules/repair/dtos/repair.response.dto';
import { RepairMapper } from '@modules/repair/mappers/repair.mapper';
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
  FindRepairQuery,
  FindRepairQueryResult,
} from './find-repair.query-handler';

@Controller(routesV1.version)
export class FindRepairHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairMapper,
  ) {}

  @ApiTags(`${resourcesV1.REPAIR.parent} - ${resourcesV1.REPAIR.displayName}`)
  @ApiOperation({ summary: 'Find one Repair' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Repair ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RepairResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RepairNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REPAIR.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.repair.getOne)
  async findRepair(@Param('id') repairId: bigint): Promise<RepairResponseDto> {
    const query = new FindRepairQuery(repairId);
    const result: FindRepairQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (repair) => this.mapper.toResponse(repair),
      Err: (error) => {
        if (error instanceof RepairNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
