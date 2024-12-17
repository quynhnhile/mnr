import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import { SymbolResponseDto } from '@modules/symbol/dtos/symbol.response.dto';
import { SymbolMapper } from '@modules/symbol/mappers/symbol.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  ConflictException as ConflictHttpException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSymbolCommand } from './create-symbol.command';
import { CreateSymbolRequestDto } from './create-symbol.request.dto';
import { CreateSymbolServiceResult } from './create-symbol.service';
import { SymbolCodeAlreadyExistsError } from '../../domain/symbol.error';

@Controller(routesV1.version)
export class CreateSymbolHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: SymbolMapper,
  ) {}

  @ApiTags(`${resourcesV1.SYMBOL.parent} - ${resourcesV1.SYMBOL.displayName}`)
  @ApiOperation({ summary: 'Create a Symbol' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SymbolResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: SymbolCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.SYMBOL.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.symbol.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateSymbolRequestDto,
  ): Promise<SymbolResponseDto> {
    const command = new CreateSymbolCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateSymbolServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (symbol: SymbolEntity) => this.mapper.toResponse(symbol),
      Err: (error: Error) => {
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
