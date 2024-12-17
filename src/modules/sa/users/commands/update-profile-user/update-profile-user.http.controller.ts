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
import { UpdateProfileUserCommand } from './update-profile-user.command';
import { UpdateProfileUserRequestDto } from './update-profile-user.request.dto';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
} from '../../domain/user.error';
import { UpdateProfileUserCommandResult } from './update-profile-user.service';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class UpdateProfileUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.USER.parent} - ${resourcesV1.USER.displayName}`)
  @ApiOperation({ summary: 'Update profile for an User' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'User Id',
    type: 'string',
    required: true,
    example: '',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.USER.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.sa.user.updateProfile)
  async update(
    @Param('id') userId: string,
    @Body() body: UpdateProfileUserRequestDto,
  ): Promise<UserResponseDto> {
    const command = new UpdateProfileUserCommand({
      userId,
      ...body,
    });

    const result: UpdateProfileUserCommandResult =
      await this.commandBus.execute(command);

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
        if (error instanceof UserNotFoundError) {
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
