import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import { ContSizeMapCodeAlreadyExistsError } from '@modules/cont-size-map/domain/cont-size-map.error';
import { ContSizeMapResponseDto } from '@modules/cont-size-map/dtos/cont-size-map.response.dto';
import { ContSizeMapMapper } from '@modules/cont-size-map/mappers/cont-size-map.mapper';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateContSizeMapCommand } from './create-cont-size-map.command';
import { CreateContSizeMapRequestDto } from './create-cont-size-map.request.dto';
import { CreateContSizeMapServiceResult } from './create-cont-size-map.service';

@Controller(routesV1.version)
export class CreateContSizeMapHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ContSizeMapMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CONT_SIZE_MAP.parent} - ${resourcesV1.CONT_SIZE_MAP.displayName}`,
  )
  @ApiOperation({ summary: 'Create a ContSizeMap' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ContSizeMapResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  // @ApiResponse({
  //   status: HttpStatus.CONFLICT,
  //   description: ContSizeMapCodeAlreadyExistsError.message,
  //   type: ApiErrorResponse,
  // })
  @AuthPermission(resourcesV1.CONT_SIZE_MAP.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.contSizeMap.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateContSizeMapRequestDto,
  ): Promise<ContSizeMapResponseDto> {
    const command = new CreateContSizeMapCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateContSizeMapServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (contSizeMap: ContSizeMapEntity) =>
        this.mapper.toResponse(contSizeMap),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            code: error.code,
          });
        }

        if (error instanceof ContSizeMapCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            code: error.code,
          });
        }
        throw error;
      },
    });
  }
}
