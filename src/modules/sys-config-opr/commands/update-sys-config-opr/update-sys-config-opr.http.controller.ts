import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import {
  OperationCodeAlreadyExistError,
  SysConfigOprNotFoundError,
} from '@modules/sys-config-opr/domain/sys-config-opr.error';
import { SysConfigOprResponseDto } from '@modules/sys-config-opr/dtos/sys-config-opr.response.dto';
import { SysConfigOprMapper } from '@modules/sys-config-opr/mappers/sys-config-opr.mapper';
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
import { UpdateSysConfigOprCommand } from './update-sys-config-opr.command';
import { UpdateSysConfigOprRequestDto } from './update-sys-config-opr.request.dto';
import { UpdateSysConfigOprServiceResult } from './update-sys-config-opr.service';

@Controller(routesV1.version)
export class UpdateSysConfigOprHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SysConfigOprMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SYS_CONFIG_OPR.parent} - ${resourcesV1.SYS_CONFIG_OPR.displayName}`,
  )
  @ApiOperation({ summary: 'Update a SysConfigOpr' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'SysConfigOpr ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SysConfigOprResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SysConfigOprNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: OperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYS_CONFIG_OPR.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.sysConfigOpr.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') sysConfigOprId: bigint,
    @Body() body: UpdateSysConfigOprRequestDto,
  ): Promise<SysConfigOprResponseDto> {
    const command = new UpdateSysConfigOprCommand({
      sysConfigOprId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateSysConfigOprServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (sysConfigOpr: SysConfigOprEntity) =>
        this.mapper.toResponse(sysConfigOpr),
      Err: (error: Error) => {
        if (error instanceof SysConfigOprNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof OperationCodeAlreadyExistError) {
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
