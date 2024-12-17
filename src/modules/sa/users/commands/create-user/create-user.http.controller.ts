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
import { CreateUserCommand } from './create-user.command';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { CreateUserRequestDto } from './create-user.request.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { UserAlreadyExistsError } from '../../domain/user.error';
import { CreateUserCommandResult } from './create-user.service';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.USER.parent} - ${resourcesV1.USER.displayName}`)
  @ApiOperation({ summary: 'Create an User' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.USER.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.sa.user.root)
  async create(@Body() body: CreateUserRequestDto): Promise<UserResponseDto> {
    const command = new CreateUserCommand({
      ...body,
    });

    const result: CreateUserCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (userResponseDto: UserResponseDto) => {
        return userResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError) {
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
