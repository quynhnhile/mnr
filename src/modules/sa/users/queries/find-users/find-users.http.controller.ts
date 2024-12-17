import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindUsersQueryHandler,
  FindUsersQuery,
} from './find-users.query-handler';
import { UserPaginatedResponseDto } from '../../dtos/user.paginated.response.dto';
import { UserResponseDto } from '../../dtos/user.response.dto';

@Controller(routesV1.version)
export class FindUsersHttpController {
  constructor(private readonly findUserQueryHandler: FindUsersQueryHandler) {}

  @ApiTags(`${resourcesV1.USER.parent} - ${resourcesV1.USER.displayName}`)
  @ApiOperation({ summary: 'Find Users' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.USER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.user.root)
  async findUsers(): Promise<UserResponseDto[]> {
    new FindUsersQuery();
    return await this.findUserQueryHandler.execute();
  }
}
