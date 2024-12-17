import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import {
  ContSizeMapCodeAlreadyExistsError,
  ContSizeMapNotFoundError,
} from '@modules/cont-size-map/domain/cont-size-map.error';
import { ContSizeMapResponseDto } from '@modules/cont-size-map/dtos/cont-size-map.response.dto';
import { ContSizeMapMapper } from '@modules/cont-size-map/mappers/cont-size-map.mapper';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import {
  Body,
  ConflictException as ConflictHttpException,
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
import { UpdateContSizeMapCommand } from './update-cont-size-map.command';
import { UpdateContSizeMapRequestDto } from './update-cont-size-map.request.dto';
import { UpdateContSizeMapCommandResult } from './update-cont-size-map.service';

@Controller(routesV1.version)
export class UpdateContSizeMapHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ContSizeMapMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONT_SIZE_MAP.parent} - ${resourcesV1.CONT_SIZE_MAP.displayName}`,
  )
  @ApiOperation({ summary: 'Update a ContSizeMap' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ContSizeMap ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ContSizeMapResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${ContSizeMapNotFoundError.message} | ${OperationNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  // @ApiResponse({
  //   status: HttpStatus.CONFLICT,
  //   description: ContSizeMapCodeAlreadyExistsError.message,
  //   type: ApiErrorResponse,
  // })
  @AuthPermission(resourcesV1.CONT_SIZE_MAP.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.contSizeMap.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') contSizeMapId: bigint,
    @Body() body: UpdateContSizeMapRequestDto,
  ): Promise<ContSizeMapResponseDto> {
    const command = new UpdateContSizeMapCommand({
      contSizeMapId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateContSizeMapCommandResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (contSizeMap: ContSizeMapEntity) =>
        this.mapper.toResponse(contSizeMap),
      Err: (error: Error) => {
        if (
          error instanceof ContSizeMapNotFoundError ||
          error instanceof OperationNotFoundError
        ) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ContSizeMapCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
