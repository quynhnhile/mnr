import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { ClassifyEntity } from '@modules/classify/domain/classify.entity';
import {
  ClassifyCodeAlreadyExsitError,
  ClassifyNotFoundError,
  ClassifyCodeAlreadyInUseError,
} from '@modules/classify/domain/classify.error';
import { ClassifyResponseDto } from '@modules/classify/dtos/classify.response.dto';
import { ClassifyMapper } from '@modules/classify/mappers/classify.mapper';
import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  ConflictException as ConflictHttpException,
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
import { UpdateClassifyCommand } from './update-classify.command';
import { UpdateClassifyRequestDto } from './update-classify.request.dto';
import { UpdateClassifyServiceResult } from './update-classify.service';

@Controller(routesV1.version)
export class UpdateClassifyHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ClassifyMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.CLASSIFY.parent} - ${resourcesV1.CLASSIFY.displayName}`,
  )
  @ApiOperation({ summary: 'Update a Classify' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Classify ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClassifyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClassifyNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ClassifyCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ClassifyCodeAlreadyExsitError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.CLASSIFY.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.classify.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') classifyId: bigint,
    @Body() body: UpdateClassifyRequestDto,
  ): Promise<ClassifyResponseDto> {
    const command = new UpdateClassifyCommand({
      classifyId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateClassifyServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (classify: ClassifyEntity) => this.mapper.toResponse(classify),
      Err: (error: Error) => {
        if (error instanceof ClassifyNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        if (error instanceof ClassifyCodeAlreadyInUseError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }

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
