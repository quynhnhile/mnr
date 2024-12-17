import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { RepairContResponseDto } from '@modules/repair-cont/dtos/repair-cont.response.dto';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateRepairContCommand } from './update-repair-cont.command';
import { UpdateRepairContRequestDto } from './update-repair-cont.request.dto';
import { UpdateRepairContServiceResult } from './update-repair-cont.service';

@Controller(routesV1.version)
export class UpdateRepairContHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Update a RepairCont' })
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
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.repairCont.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') repairContId: bigint,
    @Body() body: UpdateRepairContRequestDto,
  ): Promise<RepairContResponseDto> {
    const command = new UpdateRepairContCommand({
      repairContId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateRepairContServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (repairCont: RepairContEntity) => this.mapper.toResponse(repairCont),
      Err: (error: Error) => {
        if (error instanceof RepairContNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
