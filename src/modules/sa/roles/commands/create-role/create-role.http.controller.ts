import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
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
import { CreateRoleCommand } from './create-role.command';
import { RoleResponseDto } from '../../dtos/role.response.dto';
import { CreateRoleRequestDto } from './create-role.request.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { RoleAlreadyExistsError } from '../../domain/role.error';
import { match } from 'oxide.ts';
import { CreateRoleCommandResult } from './create-role.service';

@Controller(routesV1.version)
export class CreateRoleHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.ROLE.parent} - ${resourcesV1.ROLE.displayName}`)
  @ApiOperation({ summary: 'Create a Role' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: RoleAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ROLE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.sa.role.root)
  async create(@Body() body: CreateRoleRequestDto): Promise<RoleResponseDto> {
    const command = new CreateRoleCommand({
      roleName: body.roleName,
      description: body.description,
    });

    const result: CreateRoleCommandResult = await this.commandBus.execute(
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
        throw error;
      },
    });
  }
}
