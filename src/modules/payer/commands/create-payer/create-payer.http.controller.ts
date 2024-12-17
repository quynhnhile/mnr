import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { PayerCodeAlreadyExistsError } from '@modules/payer/domain/payer.error';
import { PayerEntity } from '@modules/payer/domain/payer.entity';
import { PayerResponseDto } from '@modules/payer/dtos/payer.response.dto';
import { PayerMapper } from '@modules/payer/mappers/payer.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
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
import { CreatePayerCommand } from './create-payer.command';
import { CreatePayerRequestDto } from './create-payer.request.dto';
import { CreatePayerCommandResult } from './create-payer.service';

@Controller(routesV1.version)
export class CreatePayerHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: PayerMapper,
  ) {}

  @ApiTags(`${resourcesV1.PAYER.parent} - ${resourcesV1.PAYER.displayName}`)
  @ApiOperation({ summary: 'Create a Payer' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PayerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: PayerCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.PAYER.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.payer.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreatePayerRequestDto,
  ): Promise<PayerResponseDto> {
    const command = new CreatePayerCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreatePayerCommandResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (payer: PayerEntity) => this.mapper.toResponse(payer),
      Err: (error: Error) => {
        if (error instanceof PayerCodeAlreadyExistsError) {
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
