import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import { SysConfigOprResponseDto } from '@modules/sys-config-opr/dtos/sys-config-opr.response.dto';
import { SysConfigOprMapper } from '@modules/sys-config-opr/mappers/sys-config-opr.mapper';
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
import { CreateSysConfigOprCommand } from './create-sys-config-opr.command';
import { CreateSysConfigOprRequestDto } from './create-sys-config-opr.request.dto';
import { CreateSysConfigOprServiceResult } from './create-sys-config-opr.service';
import { OperationCodeAlreadyExistError } from '../../domain/sys-config-opr.error';

@Controller(routesV1.version)
export class CreateSysConfigOprHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SysConfigOprMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SYS_CONFIG_OPR.parent} - ${resourcesV1.SYS_CONFIG_OPR.displayName}`,
  )
  @ApiOperation({ summary: 'Create a SysConfigOpr' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SysConfigOprResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: OperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYS_CONFIG_OPR.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.sysConfigOpr.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateSysConfigOprRequestDto,
  ): Promise<SysConfigOprResponseDto> {
    const command = new CreateSysConfigOprCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateSysConfigOprServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (sysConfigOpr: SysConfigOprEntity) =>
        this.mapper.toResponse(sysConfigOpr),
      Err: (error: Error) => {
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
