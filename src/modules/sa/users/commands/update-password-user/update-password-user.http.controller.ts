import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  Body,
  NotFoundException as NotFoundHttpException,
  Controller,
  HttpStatus,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePasswordUserCommand } from './update-password-user.command';
import { UpdatePasswordUserRequestDto } from './update-password-user.request.dto';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { UserNotFoundError } from '../../domain/user.error';
import { UpdatePasswordUserCommandResult } from './update-password-user.service';
import { match } from 'oxide.ts';
import { AuthPermission } from '@src/libs/decorators/auth-permission.decorator';

@Controller(routesV1.version)
export class UpdatePasswordUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.USER.parent} - ${resourcesV1.USER.displayName}`)
  @ApiOperation({ summary: 'Update password for an user' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
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
  @AuthPermission(resourcesV1.USER.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.sa.user.updatePass)
  async update(
    @Param('id') userId: string,
    @Body() body: UpdatePasswordUserRequestDto,
  ): Promise<UserResponseDto> {
    const command = new UpdatePasswordUserCommand({
      userId,
      ...body,
    });

    const result: UpdatePasswordUserCommandResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (userResponseDto: UserResponseDto) => {
        return userResponseDto;
      },
      Err: (error: Error) => {
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
