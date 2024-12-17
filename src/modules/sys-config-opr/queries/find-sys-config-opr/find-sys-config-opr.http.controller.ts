import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SysConfigOprNotFoundError } from '@modules/sys-config-opr/domain/sys-config-opr.error';
import { SysConfigOprResponseDto } from '@modules/sys-config-opr/dtos/sys-config-opr.response.dto';
import { SysConfigOprMapper } from '@modules/sys-config-opr/mappers/sys-config-opr.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindSysConfigOprQuery,
  FindSysConfigOprQueryResult,
} from './find-sys-config-opr.query-handler';

@Controller(routesV1.version)
export class FindSysConfigOprHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: SysConfigOprMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.SYS_CONFIG_OPR.parent} - ${resourcesV1.SYS_CONFIG_OPR.displayName}`,
  )
  @ApiOperation({ summary: 'Find one SysConfigOpr' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'SysConfigOpr ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SysConfigOprResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SysConfigOprNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYS_CONFIG_OPR.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sysConfigOpr.getOne)
  async findSysConfigOpr(
    @Param('id') sysConfigOprId: bigint,
  ): Promise<SysConfigOprResponseDto> {
    const query = new FindSysConfigOprQuery(sysConfigOprId);
    const result: FindSysConfigOprQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (sysConfigOpr) => this.mapper.toResponse(sysConfigOpr),
      Err: (error) => {
        if (error instanceof SysConfigOprNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
