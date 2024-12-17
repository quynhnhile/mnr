import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { InfoContResponseDto } from '@modules/info-cont/dtos/info-cont.response.dto';
import { InfoContMapper } from '@modules/info-cont/mappers/info-cont.mapper';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import {
  Body,
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
import { CreateInfoContCommand } from './create-info-cont.command';
import { CreateInfoContRequestDto } from './create-info-cont.request.dto';
import { CreateInfoContCommandResult } from './create-info-cont.service';

@Controller(routesV1.version)
export class CreateInfoContHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: InfoContMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.INFO_CONT.parent} - ${resourcesV1.INFO_CONT.displayName}`,
  )
  @ApiOperation({ summary: 'Create a InfoCont' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: InfoContResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OperationNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.INFO_CONT.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.infoCont.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateInfoContRequestDto,
  ): Promise<InfoContResponseDto> {
    const command = new CreateInfoContCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateInfoContCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (infoCont: InfoContEntity) => this.mapper.toResponse(infoCont),
      Err: (error: Error) => {
        if (error instanceof OperationNotFoundError) {
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
