import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import {
  MnrOverCodeAlreadyExsitError,
  MnrOverNotFoundError,
} from '@modules/mnr-over/domain/mnr-over.error';
import { MnrOverResponseDto } from '@modules/mnr-over/dtos/mnr-over.response.dto';
import { MnrOverMapper } from '@modules/mnr-over/mappers/mnr-over.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  ConflictException as ConflictHttpException,
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
import { UpdateMnrOverCommand } from './update-mnr-over.command';
import { UpdateMnrOverRequestDto } from './update-mnr-over.request.dto';
import { UpdateMnrOverServiceResult } from './update-mnr-over.service';

@Controller(routesV1.version)
export class UpdateMnrOverHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MnrOverMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.MNR_OVER.parent} - ${resourcesV1.MNR_OVER.displayName}`,
  )
  @ApiOperation({ summary: 'Update a MnrOver' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'MnrOver ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MnrOverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MnrOverNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: MnrOverCodeAlreadyExsitError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.MNR_OVER.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.mnrOver.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') mnrOverId: bigint,
    @Body() body: UpdateMnrOverRequestDto,
  ): Promise<MnrOverResponseDto> {
    const command = new UpdateMnrOverCommand({
      mnrOverId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateMnrOverServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (mnrOver: MnrOverEntity) => this.mapper.toResponse(mnrOver),
      Err: (error: Error) => {
        if (error instanceof MnrOverNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof MnrOverCodeAlreadyExsitError) {
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
