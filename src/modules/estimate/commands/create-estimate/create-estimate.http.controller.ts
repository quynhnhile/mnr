import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { EstimateResponseDto } from '@modules/estimate/dtos/estimate.response.dto';
import { EstimateMapper } from '@modules/estimate/mappers/estimate.mapper';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEstimateCommand } from './create-estimate.command';
import { CreateEstimateRequestDto } from './create-estimate.request.dto';
import { CreateEstimateServiceResult } from './create-estimate.service';

@Controller(routesV1.version)
export class CreateEstimateHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Create an Estimate' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: EstimateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RepairContNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.estimate.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateEstimateRequestDto,
  ): Promise<EstimateResponseDto> {
    const { estimateDetails = [], ...restBody } = body;

    const command = new CreateEstimateCommand({
      ...restBody,
      estimateBy: user.username,
      createdBy: user.username,
      estimateDetails: estimateDetails.map((detail) => ({
        ...detail,
        idEstimate: BigInt(0), // idEstimate is temporary
        estimateNo: 'temp', // estimateNo is temporary
        createdBy: user.username,
      })),
    });

    const result: CreateEstimateServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (estimate: EstimateEntity) => this.mapper.toResponse(estimate),
      Err: (error: Error) => {
        if (error instanceof RepairContNotFoundError) {
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
