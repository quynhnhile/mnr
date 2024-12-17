import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import {
  ContainerCodeAlreadyExistsError,
  ContainerNotFoundError,
} from '@modules/container/domain/container.error';
import { ContainerResponseDto } from '@modules/container/dtos/container.response.dto';
import { ContainerMapper } from '@modules/container/mappers/container.mapper';
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
import { UpdateContainerCommand } from './update-container.command';
import { UpdateContainerRequestDto } from './update-container.request.dto';
import { UpdateContainerCommandResult } from './update-container.service';

@Controller(routesV1.version)
export class UpdateContainerHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ContainerMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONTAINER.parent} - ${resourcesV1.CONTAINER.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Container' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Container ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ContainerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ContainerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ContainerCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONTAINER.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.container.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') containerId: bigint,
    @Body() body: UpdateContainerRequestDto,
  ): Promise<ContainerResponseDto> {
    const command = new UpdateContainerCommand({
      containerId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateContainerCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (container: ContainerEntity) => this.mapper.toResponse(container),
      Err: (error: Error) => {
        if (error instanceof ContainerNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ContainerCodeAlreadyExistsError) {
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
