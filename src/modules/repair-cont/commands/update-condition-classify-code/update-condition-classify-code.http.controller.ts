import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
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
import { UpdateConditionClassifyCodeCommand } from './update-condition-classify-code.command';
import { UpdateConditionClassifyCodeRequestDto } from './update-condition-classify-code.request.dto';

@Controller(routesV1.version)
export class UpdateConditionClassifyCodeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Update a RepairCont' })
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
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.repairCont.updateConditionAndClassify)
  async update(
    @ReqUser() user: RequestUser,
    @Body() body: UpdateConditionClassifyCodeRequestDto,
  ): Promise<RepairContResponseDto[] | null> {
    const command = new UpdateConditionClassifyCodeCommand({
      dataUpdate: body.dataUpdate.map((repairCont) => ({
        id: repairCont.id,
        conditionCode: repairCont.conditionCode,
        classifyCode: repairCont.classifyCode,
        updatedBy: user.username,
      })),
    });

    const results = this.commandBus.execute(command);
    return results;
  }
}
