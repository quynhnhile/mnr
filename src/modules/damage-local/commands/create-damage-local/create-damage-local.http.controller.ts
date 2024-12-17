import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import { DamageLocalResponseDto } from '@modules/damage-local/dtos/damage-local.response.dto';
import { DamageLocalMapper } from '@modules/damage-local/mappers/damage-local.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDamageLocalCommand } from './create-damage-local.command';
import { CreateDamageLocalRequestDto } from './create-damage-local.request.dto';
import { CreateDamageLocalServiceResult } from './create-damage-local.service';
import { DamageLocalCodeAlreadyExistError } from '../../domain/damage-local.error';

@Controller(routesV1.version)
export class CreateDamageLocalHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: DamageLocalMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.DAMAGE_LOCAL.parent} - ${resourcesV1.DAMAGE_LOCAL.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Damage local' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: DamageLocalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: DamageLocalCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE_LOCAL.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.damageLocal.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateDamageLocalRequestDto,
  ): Promise<DamageLocalResponseDto> {
    const command = new CreateDamageLocalCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateDamageLocalServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (damageLocal: DamageLocalEntity) =>
        this.mapper.toResponse(damageLocal),
      Err: (error: Error) => {
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
