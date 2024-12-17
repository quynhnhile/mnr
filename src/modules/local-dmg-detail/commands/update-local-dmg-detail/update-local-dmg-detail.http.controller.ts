import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LocalDmgDetailNotFoundError } from '@modules/local-dmg-detail/domain/local-dmg-detail.error';
import { LocalDmgDetailResponseDto } from '@modules/local-dmg-detail/dtos/local-dmg-detail.response.dto';
import { LocalDmgDetailMapper } from '@modules/local-dmg-detail/mappers/local-dmg-detail.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
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
import { UpdateLocalDmgDetailCommand } from './update-local-dmg-detail.command';
import { UpdateLocalDmgDetailRequestDto } from './update-local-dmg-detail.request.dto';
import { UpdateLocalDmgDetailServiceResult } from './update-local-dmg-detail.service';

@Controller(routesV1.version)
export class UpdateLocalDmgDetailHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: LocalDmgDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCAL_DMG_DETAIL.parent} - ${resourcesV1.LOCAL_DMG_DETAIL.displayName}`,
  )
  @ApiOperation({ summary: 'Update a LocalDmgDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'LocalDmgDetail ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LocalDmgDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: LocalDmgDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCAL_DMG_DETAIL.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.localDmgDetail.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') localDmgDetailId: bigint,
    @Body() body: UpdateLocalDmgDetailRequestDto,
  ): Promise<LocalDmgDetailResponseDto> {
    const command = new UpdateLocalDmgDetailCommand({
      localDmgDetailId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateLocalDmgDetailServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (localDmgDetail: LocalDmgDetailEntity) =>
        this.mapper.toResponse(localDmgDetail),
      Err: (error: Error) => {
        if (error instanceof LocalDmgDetailNotFoundError) {
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
