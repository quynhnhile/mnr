import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import {
  DamageCodeAlreadyInUseError,
  DamageCodeAndOperationCodeAlreadyExistError,
  DamageNotFoundError,
} from '@modules/damage/domain/damage.error';
import { DamageResponseDto } from '@modules/damage/dtos/damage.response.dto';
import { DamageMapper } from '@modules/damage/mappers/damage.mapper';
import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
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
import { UpdateDamageCommand } from './update-damage.command';
import { UpdateDamageRequestDto } from './update-damage.request.dto';
import { UpdateDamageServiceResult } from './update-damage.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

@Controller(routesV1.version)
export class UpdateDamageHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: DamageMapper,
  ) {}

  @ApiTags(`${resourcesV1.DAMAGE.parent} - ${resourcesV1.DAMAGE.displayName}`)
  @ApiOperation({ summary: 'Update a Damage' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Damage ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DamageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${DamageNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: DamageCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: DamageCodeAndOperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.damage.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') damageId: bigint,
    @Body() body: UpdateDamageRequestDto,
  ): Promise<DamageResponseDto> {
    const command = new UpdateDamageCommand({
      damageId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateDamageServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (damage: DamageEntity) => this.mapper.toResponse(damage),
      Err: (error: Error) => {
        if (error instanceof DamageNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof DamageCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof DamageCodeAndOperationCodeAlreadyExistError) {
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
