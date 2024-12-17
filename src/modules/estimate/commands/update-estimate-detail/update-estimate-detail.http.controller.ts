import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@src/modules/estimate/domain/estimate-detail.error';
import { EstimateDetailResponseDto } from '@src/modules/estimate/dtos/estimate-detail.response.dto';
import { EstimateDetailMapper } from '@src/modules/estimate/mappers/estimate-detail.mapper';
import {
  Body,
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
import { UpdateEstimateDetailCommand } from './update-estimate-detail.command';
import { UpdateEstimateDetailRequestDto } from './update-estimate-detail.request.dto';
import { UpdateEstimateDetailServiceResult } from './update-estimate-detail.service';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';

@Controller(routesV1.version)
export class UpdateEstimateDetailHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Update a EstimateDetail' })
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
    description: `${EstimateDetailNotFoundError.message} | ${RepairNotFoundError.message}`,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.estimate.estimateDetail.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('estimateId') estimateId: bigint,
    @Param('id') estimateDetailId: bigint,
    @Body() body: UpdateEstimateDetailRequestDto,
  ): Promise<EstimateDetailResponseDto> {
    const command = new UpdateEstimateDetailCommand({
      estimateId,
      estimateDetailId,
      ...body,
      updatedBy: user.id,
    });

    const result: UpdateEstimateDetailServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (estimateDetail: EstimateDetailEntity) =>
        this.mapper.toResponse(estimateDetail),
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
