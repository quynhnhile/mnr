import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import {
  SymbolCodeAlreadyExistsError,
  SymbolCodeAlreadyInUseError,
  SymbolNotFoundError,
} from '@modules/symbol/domain/symbol.error';
import { SymbolResponseDto } from '@modules/symbol/dtos/symbol.response.dto';
import { SymbolMapper } from '@modules/symbol/mappers/symbol.mapper';
import {
  BadRequestException,
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
import { UpdateSymbolCommand } from './update-symbol.command';
import { UpdateSymbolRequestDto } from './update-symbol.request.dto';
import { UpdateSymbolServiceResult } from './update-symbol.service';

@Controller(routesV1.version)
export class UpdateSymbolHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SymbolMapper,
  ) {}

  @ApiTags(`${resourcesV1.SYMBOL.parent} - ${resourcesV1.SYMBOL.displayName}`)
  @ApiOperation({ summary: 'Update a Symbol' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Symbol ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SymbolResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SymbolNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: SymbolCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYMBOL.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.symbol.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') symbolId: bigint,
    @Body() body: UpdateSymbolRequestDto,
  ): Promise<SymbolResponseDto> {
    const command = new UpdateSymbolCommand({
      symbolId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateSymbolServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (symbol: SymbolEntity) => this.mapper.toResponse(symbol),
      Err: (error: Error) => {
        if (error instanceof SymbolNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof SymbolCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof SymbolCodeAlreadyExistsError) {
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
