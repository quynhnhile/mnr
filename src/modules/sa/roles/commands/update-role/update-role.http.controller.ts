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
import { UpdateRoleCommand } from './update-role.command';
import { UpdateRoleRequestDto } from './update-role.request.dto';
import { RoleResponseDto } from '../../dtos/role.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import {
  RoleNotFoundError,
  RoleAlreadyExistsError,
} from '../../domain/role.error';
import { UpdateRoleCommandResult } from './update-role.service';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class UpdateRoleHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.ROLE.parent} - ${resourcesV1.ROLE.displayName}`)
  @ApiOperation({ summary: 'Update a Role' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'roleName',
    description: 'Role Name',
    type: 'string',
    required: true,
    example: 'ECM_test',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RoleNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: RoleAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ROLE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.sa.role.update)
  async update(
    @Param('roleName') roleName: string,
    @Body() body: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const command = new UpdateRoleCommand({
      roleName,
      description: body.description,
    });

    const result: UpdateRoleCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (roleResponseDto: RoleResponseDto) => {
        return roleResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof RoleAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof RoleNotFoundError) {
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
