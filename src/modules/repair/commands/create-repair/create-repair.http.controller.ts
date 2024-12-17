import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RepairEntity } from '@modules/repair/domain/repair.entity';
import { RepairCodeAlreadyExistError } from '@modules/repair/domain/repair.error';
import { RepairResponseDto } from '@modules/repair/dtos/repair.response.dto';
import { RepairMapper } from '@modules/repair/mappers/repair.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRepairCommand } from './create-repair.command';
import { CreateRepairRequestDto } from './create-repair.request.dto';
import { CreateRepairServiceResult } from './create-repair.service';

@Controller(routesV1.version)
export class CreateRepairHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RepairMapper,
  ) {}

  @ApiTags(`${resourcesV1.REPAIR.parent} - ${resourcesV1.REPAIR.displayName}`)
  @ApiOperation({ summary: 'Create a Repair' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RepairResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: RepairCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REPAIR.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.repair.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateRepairRequestDto,
  ): Promise<RepairResponseDto> {
    const command = new CreateRepairCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateRepairServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (repair: RepairEntity) => this.mapper.toResponse(repair),
      Err: (error: Error) => {
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
