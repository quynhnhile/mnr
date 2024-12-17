import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  ConflictException as ConflictHttpException,
  Body,
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
import { CreateResourceCommand } from './create-resource.command';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';
import { CreateResourceRequestDto } from './create-resource.request.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { ResourceAlreadyExistsError } from '../../domain/resource.error';
import { CreateResourceCommandResult } from './create-resource.service';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class CreateResourceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.RESOURCE.parent} - ${resourcesV1.RESOURCE.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Resource' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResourceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ResourceAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.RESOURCE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.sa.resource.root)
  async create(
    @Body() body: CreateResourceRequestDto,
  ): Promise<ResourceResponseDto> {
    const command = new CreateResourceCommand({
      ...body,
    });

    const result: CreateResourceCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (resourceResponseDto: ResourceResponseDto) => {
        return resourceResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof ResourceAlreadyExistsError) {
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
