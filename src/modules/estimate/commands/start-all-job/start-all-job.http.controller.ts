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
  Post,
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
import { StartAllJobCommand } from './start-all-job.command';
import { StartAllJobServiceResult } from './start-all-job.service';
import { EstimateNotFoundError } from '../../domain/estimate.error';
import { EstimateMapper } from '../../mappers/estimate.mapper';
import { StartAllJobRequestDto } from './start-all-job.request.dto';

@Controller(routesV1.version)
export class StartAllJobHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: EstimateMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.ESTIMATE.parent} - ${resourcesV1.ESTIMATE.displayName}`,
  )
  @ApiOperation({ summary: 'Start All Job' })
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
    description: 'All jobs are started',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: EstimateNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.ESTIMATE.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.estimate.start)
  async create(
    @ReqUser() user: RequestUser,
    @Param('id') estimateId: bigint,
    @Body() body: StartAllJobRequestDto,
  ): Promise<boolean> {
    const command = new StartAllJobCommand({
      estimateId,
      ...body,
      startBy: user.username,
      createdBy: user.username,
    });

    const result: StartAllJobServiceResult = await this.commandBus.execute(
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
