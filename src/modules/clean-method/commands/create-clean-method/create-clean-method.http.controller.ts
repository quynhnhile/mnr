import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { CleanMethodEntity } from '@modules/clean-method/domain/clean-method.entity';
import { CleanMethodResponseDto } from '@modules/clean-method/dtos/clean-method.response.dto';
import { CleanMethodMapper } from '@modules/clean-method/mappers/clean-method.mapper';
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
import { CreateCleanMethodCommand } from './create-clean-method.command';
import { CreateCleanMethodRequestDto } from './create-clean-method.request.dto';
import { CreateCleanMethodServiceResult } from './create-clean-method.service';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';
import { CleanMethodCodeAndOperationCodeAlreadyExistError } from '../../domain/clean-method.error';

@Controller(routesV1.version)
export class CreateCleanMethodHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CleanMethodMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLEAN_METHOD.parent} - ${resourcesV1.CLEAN_METHOD.displayName}`,
  )
  @ApiOperation({ summary: 'Create a CleanMethod' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CleanMethodResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CleanMethodCodeAndOperationCodeAlreadyExistError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLEAN_METHOD.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.cleanMethod.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateCleanMethodRequestDto,
  ): Promise<CleanMethodResponseDto> {
    const command = new CreateCleanMethodCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateCleanMethodServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (cleanMethod: CleanMethodEntity) =>
        this.mapper.toResponse(cleanMethod),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof CleanMethodCodeAndOperationCodeAlreadyExistError) {
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
