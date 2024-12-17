import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import {
  DamageLocalCodeAlreadyExistError,
  DamageLocalNotFoundError,
} from '@modules/damage-local/domain/damage-local.error';
import { DamageLocalResponseDto } from '@modules/damage-local/dtos/damage-local.response.dto';
import { DamageLocalMapper } from '@modules/damage-local/mappers/damage-local.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateDamageLocalCommand } from './update-damage-local.command';
import { UpdateDamageLocalRequestDto } from './update-damage-local.request.dto';
import { UpdateDamageLocalServiceResult } from './update-damage-local.service';

@Controller(routesV1.version)
export class UpdateDamageLocalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: DamageLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.DAMAGE_LOCAL.parent} - ${resourcesV1.DAMAGE_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Update a DamageLocal' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'DamageLocal ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DamageLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: DamageLocalNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: DamageLocalCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE_LOCAL.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.damageLocal.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') damageLocalId: bigint,
    @Body() body: UpdateDamageLocalRequestDto,
  ): Promise<DamageLocalResponseDto> {
    const command = new UpdateDamageLocalCommand({
      damageLocalId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateDamageLocalServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (damageLocal: DamageLocalEntity) =>
        this.mapper.toResponse(damageLocal),
      Err: (error: Error) => {
        if (error instanceof DamageLocalNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof DamageLocalCodeAlreadyExistError) {
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
