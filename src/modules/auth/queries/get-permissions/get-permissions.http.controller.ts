import { Result } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import {
  RequestUser,
  RequestUserPermissions,
} from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard } from '@modules/auth/guards';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPermissionsQuery } from './get-permissions.query-handler';
import { GetPermissionsResponseDto } from './get-permissions.response.dto';

@Controller(routesV1.version)
export class GetPermissionsHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'Get permissions',
    description:
      'Get all permit permissions from Keycloak of the current user, using their access token.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPermissionsResponseDto,
  })
  @UseGuards(KeycloakAuthGuard)
  @Get(routesV1.auth.permissions)
  async getPermissions(
    @ReqUser() user: RequestUser,
  ): Promise<GetPermissionsResponseDto> {
    const query = new GetPermissionsQuery(user);
    const result: Result<RequestUserPermissions[], Error> =
      await this.queryBus.execute(query);

    const unwrapResult = result.unwrap();
    return new GetPermissionsResponseDto({
      data: unwrapResult.map((permission) => ({
        rsname: permission.rsname,
        rsid: permission.rsid,
        scopes: permission.scopes,
      })),
    });
  }
}
