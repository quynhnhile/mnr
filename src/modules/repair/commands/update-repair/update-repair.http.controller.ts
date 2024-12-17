import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairEntity } from '@modules/repair/domain/repair.entity';
import {
  RepairCodeAlreadyExistError,
  RepairCodeAlreadyInUseError,
  RepairNotFoundError,
} from '@modules/repair/domain/repair.error';
import { RepairResponseDto } from '@modules/repair/dtos/repair.response.dto';
import { RepairMapper } from '@modules/repair/mappers/repair.mapper';
import {
  BadRequestException,
  Body,
  ConflictException as ConflictHttpException,
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
import { UpdateRepairCommand } from './update-repair.command';
import { UpdateRepairRequestDto } from './update-repair.request.dto';
import { UpdateRepairServiceResult } from './update-repair.service';

@Controller(routesV1.version)
export class UpdateRepairHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RepairMapper,
  ) {}

  @ApiTags(`${resourcesV1.REPAIR.parent} - ${resourcesV1.REPAIR.displayName}`)
  @ApiOperation({ summary: 'Update a Repair' })
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RepairCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: RepairCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REPAIR.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.repair.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') repairId: bigint,
    @Body() body: UpdateRepairRequestDto,
  ): Promise<RepairResponseDto> {
    const command = new UpdateRepairCommand({
      repairId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateRepairServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (repair: RepairEntity) => this.mapper.toResponse(repair),
      Err: (error: Error) => {
        if (error instanceof RepairNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof RepairCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof RepairCodeAlreadyExistError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
