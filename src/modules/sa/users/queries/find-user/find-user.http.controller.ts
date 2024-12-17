import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  NotFoundException as NotFoundHttpException,
  Controller,
  Get,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindUserQuery, FindUserQueryHandler } from './find-user.query-handler';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { match } from 'oxide.ts';
import { UserNotFoundError } from '../../domain/user.error';

@Controller(routesV1.version)
export class FindUserHttpController {
  constructor(private readonly findUserQueryHandler: FindUserQueryHandler) {}

  @ApiTags(`${resourcesV1.USER.parent} - ${resourcesV1.USER.displayName}`)
  @ApiOperation({ summary: 'Find one User' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: 'string',
    required: true,
    example: 'e15f07fc-a6a3-406e-8057-56eb280375a0',
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
  @AuthPermission(resourcesV1.USER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.user.getOne)
  async findRole(@Param('id') userId: string): Promise<UserResponseDto> {
    const query = new FindUserQuery(userId);
    const result = await this.findUserQueryHandler.execute(query);

    return match(result, {
      Ok: (userResponseDto: UserResponseDto) => {
        return userResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof UserNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
