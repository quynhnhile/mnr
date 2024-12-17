import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import { ComDamRepResponseDto } from '@modules/com-dam-rep/dtos/com-dam-rep.response.dto';
import { ComDamRepMapper } from '@modules/com-dam-rep/mappers/com-dam-rep.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
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
import { CreateComDamRepCommand } from './create-com-dam-rep.command';
import { CreateComDamRepRequestDto } from './create-com-dam-rep.request.dto';
import { CreateComDamRepServiceResult } from './create-com-dam-rep.service';
import {
  ComDamRepAlreadyExistsError,
  ComDamRepNotFoundError,
} from '../../domain/com-dam-rep.error';
import { ComponentNotFoundError } from '@src/modules/component/domain/component.error';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';

@Controller(routesV1.version)
export class CreateComDamRepHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ComDamRepMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COM_DAM_REP.parent} - ${resourcesV1.COM_DAM_REP.displayName}`,
  )
  @ApiOperation({ summary: 'Create a ComDamRep' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
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
  @AuthPermission(resourcesV1.COM_DAM_REP.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.comDamRep.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateComDamRepRequestDto,
  ): Promise<ComDamRepResponseDto> {
    const command = new CreateComDamRepCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateComDamRepServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (comDamRep: ComDamRepEntity) => this.mapper.toResponse(comDamRep),
      Err: (error: Error) => {
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
