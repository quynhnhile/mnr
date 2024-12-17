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
import { FindRoleQuery, FindRoleQueryHandler } from './find-role.query-handler';
import { RoleResponseDto } from '../../dtos/role.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { RoleNotFoundError } from '../../domain/role.error';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
export class FindRoleHttpController {
  constructor(private readonly findRoleQueryHandler: FindRoleQueryHandler) {}

  @ApiTags(`${resourcesV1.ROLE.parent} - ${resourcesV1.ROLE.displayName}`)
  @ApiOperation({ summary: 'Find one role' })
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
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RoleNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ROLE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.role.getOne)
  async findRole(
    @Param('roleName') roleName: string,
  ): Promise<RoleResponseDto> {
    const query = new FindRoleQuery(roleName);
    const result = await this.findRoleQueryHandler.execute(query);

    return match(result, {
      Ok: (roleResponseDto: RoleResponseDto) => {
        return roleResponseDto;
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
