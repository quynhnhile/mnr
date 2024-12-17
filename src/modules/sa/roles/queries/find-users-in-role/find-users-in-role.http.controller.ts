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
import {
  FindUsersInRoleQuery,
  FindUsersInRoleQueryHandler,
} from './find-users-in-role.query-handler';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { RoleNotFoundError } from '../../domain/role.error';
import { match } from 'oxide.ts';
import { FindUsersInRoleResponseDto } from './find-users-in-role.response.dto';

@Controller(routesV1.version)
export class FindUsersInRoleHttpController {
  constructor(
    private readonly findUsersInRoleQueryHandler: FindUsersInRoleQueryHandler,
  ) {}

  @ApiTags(`${resourcesV1.ROLE.parent} - ${resourcesV1.ROLE.displayName}`)
  @ApiOperation({ summary: 'Find users in role' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'roleName',
    description: 'Role name',
    type: 'string',
    required: true,
    example: 'ECM_test',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindUsersInRoleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RoleNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ROLE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.role.findUsersInRole)
  async findUsersInRole(
    @Param('roleName') roleName: string,
  ): Promise<FindUsersInRoleResponseDto[]> {
    const query = new FindUsersInRoleQuery(roleName);
    const result = await this.findUsersInRoleQueryHandler.execute(query);

    return match(result, {
      Ok: (findUsersInRoleResponseDto: FindUsersInRoleResponseDto[]) => {
        return findUsersInRoleResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof RoleNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
