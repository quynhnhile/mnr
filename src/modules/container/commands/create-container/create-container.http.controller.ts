import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import { ContainerCodeAlreadyExistsError } from '@modules/container/domain/container.error';
import { ContainerResponseDto } from '@modules/container/dtos/container.response.dto';
import { ContainerMapper } from '@modules/container/mappers/container.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateContainerCommand } from './create-container.command';
import { CreateContainerRequestDto } from './create-container.request.dto';
import { CreateContainerCommandResult } from './create-container.service';

@Controller(routesV1.version)
export class CreateContainerHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ContainerMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONTAINER.parent} - ${resourcesV1.CONTAINER.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Container' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ContainerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ContainerCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CONTAINER.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.container.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateContainerRequestDto,
  ): Promise<ContainerResponseDto> {
    const command = new CreateContainerCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateContainerCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (container: ContainerEntity) => this.mapper.toResponse(container),
      Err: (error: Error) => {
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
