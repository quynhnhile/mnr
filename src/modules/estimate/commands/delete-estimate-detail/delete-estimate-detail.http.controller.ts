import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import {
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
import { DeleteEstimateDetailCommand } from './delete-estimate-detail.command';
import { DeleteEstimateDetailServiceResult } from './delete-estimate-detail.service';

@Controller(routesV1.version)
export class DeleteEstimateDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Delete an EstimateDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'estimateId',
    description: 'Estimate ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'id',
    description: 'EstimateDetail ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'EstimateDetail deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.estimate.estimateDetail.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('estimateId') estimateId: bigint,
    @Param('id') estimateDetailId: bigint,
  ): Promise<void> {
    const command = new DeleteEstimateDetailCommand({
      estimateId,
      estimateDetailId,
    });
    const result: DeleteEstimateDetailServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof EstimateDetailNotFoundError) {
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
