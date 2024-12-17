import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import { DamageResponseDto } from '@modules/damage/dtos/damage.response.dto';
import { DamageMapper } from '@modules/damage/mappers/damage.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDamageCommand } from './create-damage.command';
import { CreateDamageRequestDto } from './create-damage.request.dto';
import { CreateDamageServiceResult } from './create-damage.service';
import { DamageCodeAndOperationCodeAlreadyExistError } from '../../domain/damage.error';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

@Controller(routesV1.version)
export class CreateDamageHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: DamageMapper,
  ) {}

  @ApiTags(`${resourcesV1.DAMAGE.parent} - ${resourcesV1.DAMAGE.displayName}`)
  @ApiOperation({ summary: 'Create a Damage' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: DamageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: DamageCodeAndOperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.DAMAGE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.damage.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateDamageRequestDto,
  ): Promise<DamageResponseDto> {
    const command = new CreateDamageCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateDamageServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (damage: DamageEntity) => this.mapper.toResponse(damage),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
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
