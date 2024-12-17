import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
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
import { CompleteAllJobCommand } from './complete-all-job.command';
import { CompleteAllJobServiceResult } from './complete-all-job.service';
import { EstimateNotFoundError } from '../../domain/estimate.error';
import { EstimateMapper } from '../../mappers/estimate.mapper';
import { CompleteAllJobRequestDto } from './complete-all-job.request.dto';

@Controller(routesV1.version)
export class CompleteAllJobHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Complete All Job' })
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
    description: 'All jobs are completed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.estimate.complete)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') estimateId: bigint,
    @Body() body: CompleteAllJobRequestDto,
  ): Promise<boolean> {
    const command = new CompleteAllJobCommand({
      estimateId,
      ...body,
      completeBy: user.username,
    });

    const result: CompleteAllJobServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (result) => (result.length > 0 ? true : false),
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
