import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import {
  EstimateAlreadyLocalApprovedError,
  EstimateNotFoundError,
} from '@modules/estimate/domain/estimate.error';
import { EstimateResponseDto } from '@modules/estimate/dtos/estimate.response.dto';
import { EstimateMapper } from '@modules/estimate/mappers/estimate.mapper';
import {
  BadRequestException,
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
import { LocalAprroveCommand } from './local-approve-estimate.command';
import { LocalApproveEstimateServiceResult } from './local-approve-estimate.service';

@Controller(routesV1.version)
export class LocalApproveEstimateHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Local approve an Estimate' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Estimate ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EstimateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: EstimateAlreadyLocalApprovedError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.estimate.approveLocal)
  async localApprove(
    @ReqUser() user: RequestUser,
    @Param('id') estimateId: bigint,
  ): Promise<EstimateResponseDto> {
    const command = new LocalAprroveCommand({
      estimateId,
      localApprovalBy: user.username,
      updatedBy: user.username,
    });

    const result: LocalApproveEstimateServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (estimate: EstimateEntity) => this.mapper.toResponse(estimate),
      Err: (error: Error) => {
        if (error instanceof EstimateNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof EstimateAlreadyLocalApprovedError) {
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
