import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  Body,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
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
import { UpdateResourceCommand } from './update-resource.command';
import { UpdateResourceRequestDto } from './update-resource.request.dto';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import {
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
} from '../../domain/resource.error';
import { UpdateResourceCommandResult } from './update-resource.service';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class UpdateResourceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.RESOURCE.parent} - ${resourcesV1.RESOURCE.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Resource' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Resource Id',
    type: 'string',
    required: true,
    example: '',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResourceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ResourceNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ResourceAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.RESOURCE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.sa.resource.update)
  async update(
    @Param('id') resourceId: string,
    @Body() body: UpdateResourceRequestDto,
  ): Promise<ResourceResponseDto> {
    const command = new UpdateResourceCommand({
      resourceId,
      ...body,
    });

    const result: UpdateResourceCommandResult = await this.commandBus.execute(
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
        if (error instanceof ResourceNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
