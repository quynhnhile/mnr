import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanModeEntity } from '@modules/clean-mode/domain/clean-mode.entity';
import { CleanModeResponseDto } from '@modules/clean-mode/dtos/clean-mode.response.dto';
import { CleanModeMapper } from '@modules/clean-mode/mappers/clean-mode.mapper';
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
import { CreateCleanModeCommand } from './create-clean-mode.command';
import { CreateCleanModeRequestDto } from './create-clean-mode.request.dto';
import { CreateCleanModeServiceResult } from './create-clean-mode.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';
import { CleanModeCodeAndOperationCodeAlreadyExistError } from '../../domain/clean-mode.error';

@Controller(routesV1.version)
export class CreateCleanModeHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CleanModeMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_MODE.parent} - ${resourcesV1.CLEAN_MODE.displayName}`,
  )
  @ApiOperation({ summary: 'Create a CleanMode' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CleanModeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CleanModeCodeAndOperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_MODE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.cleanMode.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateCleanModeRequestDto,
  ): Promise<CleanModeResponseDto> {
    const command = new CreateCleanModeCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateCleanModeServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (cleanMode: CleanModeEntity) => this.mapper.toResponse(cleanMode),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof CleanModeCodeAndOperationCodeAlreadyExistError) {
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
