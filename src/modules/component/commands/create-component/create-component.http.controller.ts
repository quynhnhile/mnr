import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ComponentEntity } from '@modules/component/domain/component.entity';
import { ComponentCodeAlreadyExistsError } from '@modules/component/domain/component.error';
import { ComponentResponseDto } from '@modules/component/dtos/component.response.dto';
import { ComponentMapper } from '@modules/component/mappers/component.mapper';
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
import { CreateComponentCommand } from './create-component.command';
import { CreateComponentRequestDto } from './create-component.request.dto';
import { CreateComponentServiceResult } from './create-component.service';

@Controller(routesV1.version)
export class CreateComponentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ComponentMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.COMPONENT.parent} - ${resourcesV1.COMPONENT.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Component' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ComponentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ComponentCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.COMPONENT.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.component.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateComponentRequestDto,
  ): Promise<ComponentResponseDto> {
    const command = new CreateComponentCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateComponentServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (component: ComponentEntity) => this.mapper.toResponse(component),
      Err: (error: Error) => {
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
