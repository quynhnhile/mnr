import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { RepairContResponseDto } from '@modules/repair-cont/dtos/repair-cont.response.dto';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
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
  FindRepairContQuery,
  FindRepairContQueryResult,
} from './find-repair-cont.query-handler';

@Controller(routesV1.version)
export class FindRepairContHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Find one RepairCont' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'RepairCont ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RepairContResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RepairContNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.repairCont.getOne)
  async findRepairCont(
    @Param('id') repairContId: bigint,
  ): Promise<RepairContResponseDto> {
    const query = new FindRepairContQuery(repairContId);
    const result: FindRepairContQueryResult = await this.queryBus.execute(
      query,
    );

    return match(result, {
      Ok: (repairCont) => this.mapper.toResponse(repairCont),
      Err: (error) => {
        if (error instanceof RepairContNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
