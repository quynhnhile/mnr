import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { InfoContResponseDto } from '@modules/info-cont/dtos/info-cont.response.dto';
import { InfoContMapper } from '@modules/info-cont/mappers/info-cont.mapper';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
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
import { UpdateInfoContCommand } from './update-info-cont.command';
import { UpdateInfoContRequestDto } from './update-info-cont.request.dto';
import { UpdateInfoContCommandResult } from './update-info-cont.service';

@Controller(routesV1.version)
export class UpdateInfoContHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: InfoContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.INFO_CONT.parent} - ${resourcesV1.INFO_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Update a InfoCont' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'InfoCont ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InfoContResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${InfoContNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.INFO_CONT.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.infoCont.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') infoContId: bigint,
    @Body() body: UpdateInfoContRequestDto,
  ): Promise<InfoContResponseDto> {
    const command = new UpdateInfoContCommand({
      infoContId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateInfoContCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (infoCont: InfoContEntity) => this.mapper.toResponse(infoCont),
      Err: (error: Error) => {
        if (
          error instanceof InfoContNotFoundError ||
          error instanceof OperationNotFoundError
        ) {
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
