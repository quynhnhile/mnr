import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { JobRepairCleanNotFoundError } from '@modules/job-repair-clean/domain/job-repair-clean.error';
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
import { DeleteJobRepairCleanCommand } from './delete-job-repair-clean.command';
import { DeleteJobRepairCleanServiceResult } from './delete-job-repair-clean.service';

@Controller(routesV1.version)
export class DeleteJobRepairCleanHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(
    `${resourcesV1.JOB_REPAIR_CLEAN.parent} - ${resourcesV1.JOB_REPAIR_CLEAN.displayName}`,
  )
  @ApiOperation({ summary: 'Delete a JobRepairClean' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'JobRepairClean ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'JobRepairClean deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: JobRepairCleanNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.JOB_REPAIR_CLEAN.name, resourceScopes.DELETE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Delete(routesV1.jobRepairClean.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') jobRepairCleanId: bigint): Promise<void> {
    const command = new DeleteJobRepairCleanCommand({ jobRepairCleanId });
    const result: DeleteJobRepairCleanServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof JobRepairCleanNotFoundError) {
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
