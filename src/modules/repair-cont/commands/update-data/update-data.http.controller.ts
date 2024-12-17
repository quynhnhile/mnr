import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContResponseDto } from '@modules/repair-cont/dtos/repair-cont.response.dto';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateDataCommand } from './update-data.command';
import { UpdateDataRequestDto } from './update-data.request.dto';

@Controller(routesV1.version)
export class UpdateDataHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Update data' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateDataRequestDto,
  })
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.repairCont.updateData)
  async update(
    @ReqUser() user: RequestUser,
    @Body() body: UpdateDataRequestDto,
  ): Promise<RepairContResponseDto[] | null> {
    const command = new UpdateDataCommand({
      dataUpdate: body.dataUpdate.map((data) => ({
        id: data.id,
        conditionCode: data.conditionCode,
        classifyCode: data.classifyCode,
        estimateDate: data.estimateDate,
        estimateBy: data.estimateBy,
        approvalDate: data.approvalDate,
        completeDate: data.completeDate,
        noteEstimate: data.noteEstimate,
        updatedBy: user.username,
      })),
    });

    const results = this.commandBus.execute(command);
    return results;
  }
}
