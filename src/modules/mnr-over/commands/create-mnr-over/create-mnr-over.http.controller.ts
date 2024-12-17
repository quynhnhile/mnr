import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import { MnrOverResponseDto } from '@modules/mnr-over/dtos/mnr-over.response.dto';
import { MnrOverMapper } from '@modules/mnr-over/mappers/mnr-over.mapper';
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
import { CreateMnrOverCommand } from './create-mnr-over.command';
import { CreateMnrOverRequestDto } from './create-mnr-over.request.dto';
import { CreateMnrOverServiceResult } from './create-mnr-over.service';
import { MnrOverCodeAlreadyExsitError } from '../../domain/mnr-over.error';

@Controller(routesV1.version)
export class CreateMnrOverHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MnrOverMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.MNR_OVER.parent} - ${resourcesV1.MNR_OVER.displayName}`,
  )
  @ApiOperation({ summary: 'Create a MnrOver' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MnrOverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: MnrOverCodeAlreadyExsitError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.MNR_OVER.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.mnrOver.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateMnrOverRequestDto,
  ): Promise<MnrOverResponseDto> {
    const command = new CreateMnrOverCommand({
      ...body,
      createdBy: user.id,
    });

    const result: CreateMnrOverServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (mnrOver: MnrOverEntity) => this.mapper.toResponse(mnrOver),
      Err: (error: Error) => {
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
