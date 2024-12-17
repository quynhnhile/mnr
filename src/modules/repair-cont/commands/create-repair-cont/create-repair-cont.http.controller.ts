import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContResponseDto } from '@modules/repair-cont/dtos/repair-cont.response.dto';
import { RepairContMapper } from '@modules/repair-cont/mappers/repair-cont.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  NotFoundException as NotFoundHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRepairContCommand } from './create-repair-cont.command';
import { CreateRepairContRequestDto } from './create-repair-cont.request.dto';
import { CreateRepairContServiceResult } from './create-repair-cont.service';
import { ContainerNotFoundError } from '@src/modules/container/domain/container.error';

@Controller(routesV1.version)
export class CreateRepairContHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RepairContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.REPAIR_CONT.parent} - ${resourcesV1.REPAIR_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Create a RepairCont' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RepairContResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ContainerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REPAIR_CONT.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.repairCont.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateRepairContRequestDto,
  ): Promise<RepairContResponseDto> {
    const command = new CreateRepairContCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateRepairContServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (repairCont: RepairContEntity) => this.mapper.toResponse(repairCont),
      Err: (error: Error) => {
        if (error instanceof ContainerNotFoundError) {
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
