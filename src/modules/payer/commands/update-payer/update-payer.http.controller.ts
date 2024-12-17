import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { PayerEntity } from '@modules/payer/domain/payer.entity';
import {
  PayerNotFoundError,
  PayerCodeAlreadyExistsError,
  PayerCodeAlreadyInUseError,
} from '@modules/payer/domain/payer.error';
import { PayerResponseDto } from '@modules/payer/dtos/payer.response.dto';
import { PayerMapper } from '@modules/payer/mappers/payer.mapper';
import {
  BadRequestException,
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
import { UpdatePayerCommand } from './update-payer.command';
import { UpdatePayerRequestDto } from './update-payer.request.dto';
import { UpdatePayerCommandResult } from './update-payer.service';

@Controller(routesV1.version)
export class UpdatePayerHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: PayerMapper,
  ) {}

  @ApiTags(`${resourcesV1.PAYER.parent} - ${resourcesV1.PAYER.displayName}`)
  @ApiOperation({ summary: 'Update a Payer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Payer ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PayerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PayerCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: PayerCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.PAYER.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.payer.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') payerId: bigint,
    @Body() body: UpdatePayerRequestDto,
  ): Promise<PayerResponseDto> {
    const command = new UpdatePayerCommand({
      payerId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdatePayerCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (payer: PayerEntity) => this.mapper.toResponse(payer),
      Err: (error: Error) => {
        if (error instanceof PayerNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof PayerCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof PayerCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
