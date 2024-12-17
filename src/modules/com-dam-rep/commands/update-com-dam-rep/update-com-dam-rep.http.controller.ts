import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import {
  ComDamRepAlreadyExistsError,
  ComDamRepNotFoundError,
} from '@modules/com-dam-rep/domain/com-dam-rep.error';
import { ComDamRepResponseDto } from '@modules/com-dam-rep/dtos/com-dam-rep.response.dto';
import { ComDamRepMapper } from '@modules/com-dam-rep/mappers/com-dam-rep.mapper';
import {
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
import { UpdateComDamRepCommand } from './update-com-dam-rep.command';
import { UpdateComDamRepRequestDto } from './update-com-dam-rep.request.dto';
import { UpdateComDamRepServiceResult } from './update-com-dam-rep.service';
import { ComponentNotFoundError } from '@src/modules/component/domain/component.error';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';

@Controller(routesV1.version)
export class UpdateComDamRepHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ComDamRepMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COM_DAM_REP.parent} - ${resourcesV1.COM_DAM_REP.displayName}`,
  )
  @ApiOperation({ summary: 'Update a ComDamRep' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ComDamRep ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ComDamRepResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${ComDamRepNotFoundError.message} | ${ComponentNotFoundError.message} | ${DamageNotFoundError.message} | ${RepairNotFoundError.message} `,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ComDamRepAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COM_DAM_REP.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.comDamRep.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') comDamRepId: bigint,
    @Body() body: UpdateComDamRepRequestDto,
  ): Promise<ComDamRepResponseDto> {
    const command = new UpdateComDamRepCommand({
      comDamRepId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateComDamRepServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (comDamRep: ComDamRepEntity) => this.mapper.toResponse(comDamRep),
      Err: (error: Error) => {
        if (error instanceof ComDamRepNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (
          error instanceof ComponentNotFoundError ||
          error instanceof DamageNotFoundError ||
          error instanceof RepairNotFoundError
        ) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof ComDamRepAlreadyExistsError) {
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
