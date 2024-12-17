import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RegionEntity } from '@modules/region/domain/region.entity';
import {
  RegionCodeAlreadyExistsError,
  RegionNotFoundError,
  RegionCodeAlreadyInUseError,
} from '@modules/region/domain/region.error';
import { RegionResponseDto } from '@modules/region/dtos/region.response.dto';
import { RegionMapper } from '@modules/region/mappers/region.mapper';
import {
  BadRequestException,
  Body,
  ConflictException as ConflictHttpException,
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
import { UpdateRegionCommand } from './update-region.command';
import { UpdateRegionRequestDto } from './update-region.request.dto';
import { UpdateRegionServiceResult } from './update-region.service';

@Controller(routesV1.version)
export class UpdateRegionHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RegionMapper,
  ) {}

  @ApiTags(`${resourcesV1.REGION.parent} - ${resourcesV1.REGION.displayName}`)
  @ApiOperation({ summary: 'Update a Region' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Region ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: RegionNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RegionCodeAlreadyInUseError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: RegionCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REGION.name, resourceScopes.UPDATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Put(routesV1.region.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') regionId: bigint,
    @Body() body: UpdateRegionRequestDto,
  ): Promise<RegionResponseDto> {
    const command = new UpdateRegionCommand({
      regionId,
      ...body,
      updatedBy: user.username,
    });

    const result: UpdateRegionServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (region: RegionEntity) => this.mapper.toResponse(region),
      Err: (error: Error) => {
        if (error instanceof RegionNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof RegionCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof RegionCodeAlreadyInUseError) {
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
