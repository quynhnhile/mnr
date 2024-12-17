import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
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
import { DeleteEstimateCommand } from './delete-estimate.command';
import { DeleteEstimateServiceResult } from './delete-estimate.service';

@Controller(routesV1.version)
export class DeleteEstimateHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Delete an Estimate' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Estimate ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Estimate deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.estimate.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') estimateId: bigint): Promise<void> {
    const command = new DeleteEstimateCommand({ estimateId });
    const result: DeleteEstimateServiceResult = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof EstimateNotFoundError) {
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
