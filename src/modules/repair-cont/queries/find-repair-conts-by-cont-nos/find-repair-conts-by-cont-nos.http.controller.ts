import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { RepairContResponseDto } from '@modules/repair-cont/dtos/repair-cont.response.dto';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindRepairContsByContainerNosQuery,
  FindRepairContsByContainerNosQueryResult,
} from './find-repair-conts-by-cont-nos.query-handler';
import { FindRepairContsByContNosRequestDto } from './find-repair-conts-by-cont-nos.request.dto';

@Controller(routesV1.version)
export class FindRepairContsByContainerNosHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({
    summary:
      'Find many RepairCont by containerNos to update condition code and classify code',
  })
  @ApiBearerAuth()
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
  @Get(routesV1.repairCont.getManyByContNos)
  async findRepairContByContainerNo(
    @Query()
    queryParams: FindRepairContsByContNosRequestDto,
  ): Promise<RepairContResponseDto[]> {
    const query = new FindRepairContsByContainerNosQuery(queryParams);
    const result: FindRepairContsByContainerNosQueryResult =
      await this.queryBus.execute(query);

    return match(result, {
      Ok: (repairCont) =>
        repairCont.map((data) => {
          return this.mapper.toResponse(data);
        }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
