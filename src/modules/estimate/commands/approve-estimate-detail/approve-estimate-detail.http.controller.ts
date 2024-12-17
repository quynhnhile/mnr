import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { EstimateDetailResponseDto } from '@modules/estimate/dtos/estimate-detail.response.dto';
import { EstimateDetailMapper } from '@modules/estimate/mappers/estimate-detail.mapper';
import {
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
import { AprroveEstimateDetailCommand } from './approve-estimate-detail.command';
import { ApproveEstimateDetailServiceResult } from './approve-estimate-detail.service';

@Controller(routesV1.version)
export class ApproveEstimateDetailHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Approve an EstimateDetail' })
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
    status: HttpStatus.OK,
    type: EstimateDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateDetailNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.estimate.estimateDetail.approve)
  async approve(
    @ReqUser() user: RequestUser,
    @Param('estimateId') estimateId: bigint,
    @Param('id') estimateDetailId: bigint,
  ): Promise<EstimateDetailResponseDto> {
    const command = new AprroveEstimateDetailCommand({
      estimateId,
      estimateDetailId,
      approvalBy: user.username,
      updatedBy: user.username,
    });

    const result: ApproveEstimateDetailServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (estimate: EstimateDetailEntity) => this.mapper.toResponse(estimate),
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
