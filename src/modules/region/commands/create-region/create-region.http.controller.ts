import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { RegionEntity } from '@modules/region/domain/region.entity';
import { RegionCodeAlreadyExistsError } from '@modules/region/domain/region.error';
import { RegionResponseDto } from '@modules/region/dtos/region.response.dto';
import { RegionMapper } from '@modules/region/mappers/region.mapper';
import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
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
import { CreateRegionCommand } from './create-region.command';
import { CreateRegionRequestDto } from './create-region.request.dto';
import { CreateRegionServiceResult } from './create-region.service';

@Controller(routesV1.version)
export class CreateRegionHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RegionMapper,
  ) {}

  @ApiTags(`${resourcesV1.REGION.parent} - ${resourcesV1.REGION.displayName}`)
  @ApiOperation({ summary: 'Create a Region' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: RegionCodeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.REGION.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.region.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateRegionRequestDto,
  ): Promise<RegionResponseDto> {
    const command = new CreateRegionCommand({
      ...body,
      createdBy: user.username,
    });

    const result: CreateRegionServiceResult = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (region: RegionEntity) => this.mapper.toResponse(region),
      Err: (error: Error) => {
        if (error instanceof RegionCodeAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
