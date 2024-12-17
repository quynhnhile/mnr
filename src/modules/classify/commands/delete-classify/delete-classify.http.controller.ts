import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  ClassifyNotFoundError,
  ClassifyCodeAlreadyInUseError,
} from '@modules/classify/domain/classify.error';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
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
import { DeleteClassifyCommand } from './delete-classify.command';
import { DeleteClassifyServiceResult } from './delete-classify.service';

@Controller(routesV1.version)
export class DeleteClassifyHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.CLASSIFY.parent} - ${resourcesV1.CLASSIFY.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a Classify' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Classify ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Classify deleted',
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
  @AuthPermission(resourcesV1.CLASSIFY.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.classify.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') classifyId: bigint): Promise<void> {
    const command = new DeleteClassifyCommand({ classifyId });
    const result: DeleteClassifyServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
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
        throw error;
      },
    });
  }
}
