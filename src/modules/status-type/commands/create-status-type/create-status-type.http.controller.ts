import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import { StatusTypeResponseDto } from '@modules/status-type/dtos/status-type.response.dto';
import { StatusTypeMapper } from '@modules/status-type/mappers/status-type.mapper';
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
import { CreateStatusTypeCommand } from './create-status-type.command';
import { CreateStatusTypeRequestDto } from './create-status-type.request.dto';
import { CreateStatusTypeServiceResult } from './create-status-type.service';
import { StatusTypeCodeAlreadyExsitError } from '../../domain/status-type.error';

@Controller(routesV1.version)
export class CreateStatusTypeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: StatusTypeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.STATUS_TYPE.parent} - ${resourcesV1.STATUS_TYPE.displayName}`,
  )
  @ApiOperation({ summary: 'Create a StatusType' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StatusTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: StatusTypeCodeAlreadyExsitError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.STATUS_TYPE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.statusType.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateStatusTypeRequestDto,
  ): Promise<StatusTypeResponseDto> {
    const command = new CreateStatusTypeCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateStatusTypeServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (statusType: StatusTypeEntity) => this.mapper.toResponse(statusType),
      Err: (error: Error) => {
        if (error instanceof StatusTypeCodeAlreadyExsitError) {
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
