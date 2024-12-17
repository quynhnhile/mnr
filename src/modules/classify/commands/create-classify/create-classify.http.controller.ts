import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ClassifyEntity } from '@modules/classify/domain/classify.entity';
import { ClassifyResponseDto } from '@modules/classify/dtos/classify.response.dto';
import { ClassifyMapper } from '@modules/classify/mappers/classify.mapper';
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
import { CreateClassifyCommand } from './create-classify.command';
import { CreateClassifyRequestDto } from './create-classify.request.dto';
import { CreateClassifyServiceResult } from './create-classify.service';
import { ClassifyCodeAlreadyExsitError } from '../../domain/classify.error';

@Controller(routesV1.version)
export class CreateClassifyHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ClassifyMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLASSIFY.parent} - ${resourcesV1.CLASSIFY.displayName}`,
  )
  @ApiOperation({ summary: 'Create a Classify' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ClassifyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ClassifyCodeAlreadyExsitError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLASSIFY.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.classify.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateClassifyRequestDto,
  ): Promise<ClassifyResponseDto> {
    const command = new CreateClassifyCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateClassifyServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (classify: ClassifyEntity) => this.mapper.toResponse(classify),
      Err: (error: Error) => {
        if (error instanceof ClassifyCodeAlreadyExsitError) {
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
