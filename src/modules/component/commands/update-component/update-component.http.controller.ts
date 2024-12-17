import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComponentEntity } from '@modules/component/domain/component.entity';
import {
  ComponentCodeAlreadyExistsError,
  ComponentCodeAlreadyInUseError,
  ComponentNotFoundError,
} from '@modules/component/domain/component.error';
import { ComponentResponseDto } from '@modules/component/dtos/component.response.dto';
import { ComponentMapper } from '@modules/component/mappers/component.mapper';
import {
  BadRequestException,
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
import { UpdateComponentCommand } from './update-component.command';
import { UpdateComponentRequestDto } from './update-component.request.dto';
import { UpdateComponentServiceResult } from './update-component.service';

@Controller(routesV1.version)
export class UpdateComponentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ComponentMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COMPONENT.parent} - ${resourcesV1.COMPONENT.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Component' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Component ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ComponentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ComponentNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ComponentCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ComponentCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COMPONENT.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.component.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') componentId: bigint,
    @Body() body: UpdateComponentRequestDto,
  ): Promise<ComponentResponseDto> {
    const command = new UpdateComponentCommand({
      componentId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateComponentServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (component: ComponentEntity) => this.mapper.toResponse(component),
      Err: (error: Error) => {
        if (error instanceof ComponentNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ComponentCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ComponentCodeAlreadyExistsError) {
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
